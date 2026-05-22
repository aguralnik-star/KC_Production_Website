-- K&C Design and Manufacturing — Live RFQ monitoring & customer conversion workflow
-- Run after 021_apply_content_table_links_when_present.sql (or 020 if 021 not applied)

-- ---------------------------------------------------------------------------
-- Live RFQ review records (1:1 with website RFQ submissions)
-- ---------------------------------------------------------------------------

create table if not exists public.crm_live_rfq_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid not null unique references public.rfq_requests(id) on delete cascade,
  review_status text not null default 'new',
  workflow_stage text not null default 'rfq_received',
  assigned_owner_id uuid references auth.users(id) on delete set null,
  source_page text,
  qualified_at timestamptz,
  disqualified_at timestamptz,
  disqualify_reason text,
  converted_to_customer_at timestamptz,
  conversion_override_by uuid references auth.users(id) on delete set null,
  conversion_override_reason text,
  needs_follow_up boolean not null default false,
  first_reviewed_at timestamptz,
  internal_notes text,
  constraint crm_live_rfq_reviews_status_check check (
    review_status in (
      'new',
      'pending_review',
      'qualified',
      'needs_more_info',
      'quoted',
      'follow_up_scheduled',
      'converted_to_customer',
      'disqualified'
    )
  ),
  constraint crm_live_rfq_reviews_workflow_stage_check check (
    workflow_stage in (
      'rfq_received',
      'internal_review',
      'qualification',
      'quote_preparation',
      'customer_follow_up',
      'quote_accepted',
      'customer_record_confirmed',
      'first_job_created',
      'converted_customer'
    )
  )
);

create index if not exists crm_live_rfq_reviews_status_idx
  on public.crm_live_rfq_reviews (review_status, created_at desc);

create index if not exists crm_live_rfq_reviews_owner_idx
  on public.crm_live_rfq_reviews (assigned_owner_id);

-- ---------------------------------------------------------------------------
-- Follow-up tasks (manual creation only — no auto customer contact)
-- ---------------------------------------------------------------------------

create table if not exists public.crm_rfq_follow_up_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  crm_live_rfq_review_id uuid references public.crm_live_rfq_reviews(id) on delete set null,
  title text not null,
  company_name text,
  contact_name text,
  contact_email text,
  due_date date,
  priority text not null default 'medium',
  recommended_action text,
  notes text,
  status text not null default 'open',
  created_by uuid references auth.users(id) on delete set null,
  constraint crm_rfq_follow_up_tasks_priority_check
    check (priority in ('low', 'medium', 'high', 'urgent')),
  constraint crm_rfq_follow_up_tasks_status_check
    check (status in ('open', 'in_progress', 'completed', 'cancelled'))
);

create index if not exists crm_rfq_follow_up_tasks_rfq_idx
  on public.crm_rfq_follow_up_tasks (rfq_request_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Quote preparation records (review-only — no automatic quote send)
-- ---------------------------------------------------------------------------

create table if not exists public.crm_quote_prep_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid not null unique references public.rfq_requests(id) on delete cascade,
  company_id uuid references public.crm_companies(id) on delete set null,
  contact_id uuid references public.crm_contacts(id) on delete set null,
  opportunity_id uuid references public.crm_opportunities(id) on delete set null,
  project_type text,
  material text,
  quantity text,
  deadline text,
  quote_status text not null default 'not_started',
  internal_notes text,
  estimated_value numeric,
  next_action text,
  constraint crm_quote_prep_records_status_check check (
    quote_status in (
      'not_started',
      'in_review',
      'ready_to_send',
      'sent_manually',
      'accepted',
      'declined'
    )
  )
);

-- ---------------------------------------------------------------------------
-- Audit trail for RFQ monitoring actions
-- ---------------------------------------------------------------------------

create table if not exists public.crm_rfq_audit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  event_type text not null,
  entity_type text not null default 'rfq_review',
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists crm_rfq_audit_events_rfq_idx
  on public.crm_rfq_audit_events (rfq_request_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Conversion workflow stage tracking
-- ---------------------------------------------------------------------------

create table if not exists public.crm_conversion_workflow_stages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  stage_key text not null,
  stage_order integer not null,
  status text not null default 'pending',
  owner_id uuid references auth.users(id) on delete set null,
  due_date date,
  notes text,
  completed_at timestamptz,
  constraint crm_conversion_workflow_stages_unique unique (rfq_request_id, stage_key),
  constraint crm_conversion_workflow_stages_status_check
    check (status in ('pending', 'in_progress', 'completed', 'blocked', 'skipped'))
);

create index if not exists crm_conversion_workflow_stages_rfq_idx
  on public.crm_conversion_workflow_stages (rfq_request_id, stage_order);

-- ---------------------------------------------------------------------------
-- Auto-create review row when public RFQ is submitted
-- ---------------------------------------------------------------------------

create or replace function public.ensure_crm_live_rfq_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_live_rfq_reviews (rfq_request_id, review_status, workflow_stage, source_page)
  values (new.id, 'new', 'rfq_received', '/contact')
  on conflict (rfq_request_id) do nothing;

  insert into public.crm_conversion_workflow_stages (rfq_request_id, stage_key, stage_order, status)
  values
    (new.id, 'rfq_received', 1, 'completed'),
    (new.id, 'internal_review', 2, 'pending'),
    (new.id, 'qualification', 3, 'pending'),
    (new.id, 'quote_preparation', 4, 'pending'),
    (new.id, 'customer_follow_up', 5, 'pending'),
    (new.id, 'quote_accepted', 6, 'pending'),
    (new.id, 'customer_record_confirmed', 7, 'pending'),
    (new.id, 'first_job_created', 8, 'pending'),
    (new.id, 'converted_customer', 9, 'pending')
  on conflict (rfq_request_id, stage_key) do nothing;

  return new;
end;
$$;

drop trigger if exists rfq_requests_create_live_review on public.rfq_requests;
create trigger rfq_requests_create_live_review
  after insert on public.rfq_requests
  for each row execute function public.ensure_crm_live_rfq_review();

-- Backfill review rows for existing RFQs
insert into public.crm_live_rfq_reviews (rfq_request_id, review_status, workflow_stage, source_page)
select id, 'new', 'rfq_received', '/contact'
from public.rfq_requests r
where not exists (
  select 1 from public.crm_live_rfq_reviews rev where rev.rfq_request_id = r.id
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

drop trigger if exists crm_live_rfq_reviews_updated_at on public.crm_live_rfq_reviews;
create trigger crm_live_rfq_reviews_updated_at
  before update on public.crm_live_rfq_reviews
  for each row execute function public.set_crm_records_updated_at();

drop trigger if exists crm_rfq_follow_up_tasks_updated_at on public.crm_rfq_follow_up_tasks;
create trigger crm_rfq_follow_up_tasks_updated_at
  before update on public.crm_rfq_follow_up_tasks
  for each row execute function public.set_crm_records_updated_at();

drop trigger if exists crm_quote_prep_records_updated_at on public.crm_quote_prep_records;
create trigger crm_quote_prep_records_updated_at
  before update on public.crm_quote_prep_records
  for each row execute function public.set_crm_records_updated_at();

drop trigger if exists crm_conversion_workflow_stages_updated_at on public.crm_conversion_workflow_stages;
create trigger crm_conversion_workflow_stages_updated_at
  before update on public.crm_conversion_workflow_stages
  for each row execute function public.set_crm_records_updated_at();

-- ---------------------------------------------------------------------------
-- Dashboard view
-- ---------------------------------------------------------------------------

create or replace view public.crm_live_rfq_dashboard_view
with (security_invoker = true)
as
select
  r.id as rfq_request_id,
  r.reference_number,
  r.created_at as submitted_at,
  r.name as contact_name,
  r.company as company_name,
  r.email,
  r.phone,
  r.project_type,
  r.material,
  r.quantity,
  r.timeline as deadline,
  r.notes,
  r.status as rfq_public_status,
  rev.id as review_id,
  rev.review_status,
  rev.workflow_stage,
  rev.assigned_owner_id,
  rev.source_page,
  rev.qualified_at,
  rev.disqualified_at,
  rev.disqualify_reason,
  rev.converted_to_customer_at,
  rev.needs_follow_up,
  rev.first_reviewed_at,
  rev.internal_notes as review_notes,
  rev.updated_at as review_updated_at,
  (rev.first_reviewed_at is null and r.created_at < now() - interval '24 hours') as overdue_without_review,
  opp.id as opportunity_id,
  opp.stage as opportunity_stage,
  qp.quote_status,
  qp.estimated_value
from public.rfq_requests r
left join public.crm_live_rfq_reviews rev on rev.rfq_request_id = r.id
left join public.crm_opportunities opp on opp.rfq_request_id = r.id
left join public.crm_quote_prep_records qp on qp.rfq_request_id = r.id;

-- ---------------------------------------------------------------------------
-- RLS — admin only
-- ---------------------------------------------------------------------------

alter table public.crm_live_rfq_reviews enable row level security;
alter table public.crm_rfq_follow_up_tasks enable row level security;
alter table public.crm_quote_prep_records enable row level security;
alter table public.crm_rfq_audit_events enable row level security;
alter table public.crm_conversion_workflow_stages enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'crm_live_rfq_reviews',
    'crm_rfq_follow_up_tasks',
    'crm_quote_prep_records',
    'crm_rfq_audit_events',
    'crm_conversion_workflow_stages'
  ]
  loop
    execute format('drop policy if exists admin_select_%I on public.%I', tbl, tbl);
    execute format(
      'create policy admin_select_%I on public.%I for select to authenticated using (public.is_admin())',
      tbl, tbl
    );
    execute format('drop policy if exists admin_insert_%I on public.%I', tbl, tbl);
    execute format(
      'create policy admin_insert_%I on public.%I for insert to authenticated with check (public.is_admin())',
      tbl, tbl
    );
    execute format('drop policy if exists admin_update_%I on public.%I', tbl, tbl);
    execute format(
      'create policy admin_update_%I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())',
      tbl, tbl
    );
    execute format('drop policy if exists admin_delete_%I on public.%I', tbl, tbl);
    execute format(
      'create policy admin_delete_%I on public.%I for delete to authenticated using (public.is_admin())',
      tbl, tbl
    );
  end loop;
end;
$$;

grant select on public.crm_live_rfq_dashboard_view to authenticated;
