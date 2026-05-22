-- K&C Design and Manufacturing — FactoraOS CRM integration bridge
-- Run after 019_post_launch_monitoring.sql

-- ---------------------------------------------------------------------------
-- Local CRM records (website-side staging before FactoraOS intake review)
-- ---------------------------------------------------------------------------

create table if not exists public.crm_companies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid references public.rfq_requests(id) on delete set null,
  name text not null,
  email text,
  phone text,
  industry text,
  internal_notes text
);

create index if not exists crm_companies_rfq_idx on public.crm_companies (rfq_request_id);

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  crm_company_id uuid not null references public.crm_companies(id) on delete cascade,
  rfq_request_id uuid references public.rfq_requests(id) on delete set null,
  name text not null,
  email text,
  phone text,
  role text
);

create index if not exists crm_contacts_company_idx on public.crm_contacts (crm_company_id);
create index if not exists crm_contacts_rfq_idx on public.crm_contacts (rfq_request_id);

create table if not exists public.crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  crm_company_id uuid not null references public.crm_companies(id) on delete cascade,
  crm_contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  name text not null,
  stage text not null default 'lead',
  estimated_value numeric,
  quoted_value numeric,
  expected_close_date date,
  project_type text,
  material text,
  quantity text,
  timeline text,
  internal_notes text,
  constraint crm_opportunities_rfq_unique unique (rfq_request_id),
  constraint crm_opportunities_stage_check
    check (stage in ('lead', 'qualified', 'quoted', 'negotiation', 'won', 'lost', 'closed'))
);

create index if not exists crm_opportunities_company_idx on public.crm_opportunities (crm_company_id);

-- ---------------------------------------------------------------------------
-- FactoraOS sync events
-- ---------------------------------------------------------------------------

create table if not exists public.factoraos_crm_sync_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  crm_company_id uuid references public.crm_companies(id) on delete set null,
  crm_contact_id uuid references public.crm_contacts(id) on delete set null,
  crm_opportunity_id uuid references public.crm_opportunities(id) on delete set null,
  sync_status text not null default 'pending',
  sync_attempted_at timestamptz,
  synced_at timestamptz,
  factoraos_intake_id text,
  error_message text,
  payload jsonb,
  constraint factoraos_crm_sync_events_status_check
    check (sync_status in ('pending', 'sent', 'accepted', 'failed', 'skipped'))
);

create index if not exists factoraos_crm_sync_events_rfq_idx
  on public.factoraos_crm_sync_events (rfq_request_id, created_at desc);

create index if not exists factoraos_crm_sync_events_status_idx
  on public.factoraos_crm_sync_events (sync_status, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_crm_records_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists crm_companies_updated_at on public.crm_companies;
create trigger crm_companies_updated_at
  before update on public.crm_companies
  for each row execute function public.set_crm_records_updated_at();

drop trigger if exists crm_contacts_updated_at on public.crm_contacts;
create trigger crm_contacts_updated_at
  before update on public.crm_contacts
  for each row execute function public.set_crm_records_updated_at();

drop trigger if exists crm_opportunities_updated_at on public.crm_opportunities;
create trigger crm_opportunities_updated_at
  before update on public.crm_opportunities
  for each row execute function public.set_crm_records_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — admin only
-- ---------------------------------------------------------------------------

alter table public.crm_companies enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_opportunities enable row level security;
alter table public.factoraos_crm_sync_events enable row level security;

drop policy if exists "admin_select_crm_companies" on public.crm_companies;
create policy "admin_select_crm_companies"
  on public.crm_companies for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_crm_companies" on public.crm_companies;
create policy "admin_insert_crm_companies"
  on public.crm_companies for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_crm_companies" on public.crm_companies;
create policy "admin_update_crm_companies"
  on public.crm_companies for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_delete_crm_companies" on public.crm_companies;
create policy "admin_delete_crm_companies"
  on public.crm_companies for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_crm_contacts" on public.crm_contacts;
create policy "admin_select_crm_contacts"
  on public.crm_contacts for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_crm_contacts" on public.crm_contacts;
create policy "admin_insert_crm_contacts"
  on public.crm_contacts for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_crm_contacts" on public.crm_contacts;
create policy "admin_update_crm_contacts"
  on public.crm_contacts for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_delete_crm_contacts" on public.crm_contacts;
create policy "admin_delete_crm_contacts"
  on public.crm_contacts for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_crm_opportunities" on public.crm_opportunities;
create policy "admin_select_crm_opportunities"
  on public.crm_opportunities for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_crm_opportunities" on public.crm_opportunities;
create policy "admin_insert_crm_opportunities"
  on public.crm_opportunities for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_crm_opportunities" on public.crm_opportunities;
create policy "admin_update_crm_opportunities"
  on public.crm_opportunities for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_delete_crm_opportunities" on public.crm_opportunities;
create policy "admin_delete_crm_opportunities"
  on public.crm_opportunities for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_factoraos_crm_sync_events" on public.factoraos_crm_sync_events;
create policy "admin_select_factoraos_crm_sync_events"
  on public.factoraos_crm_sync_events for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_factoraos_crm_sync_events" on public.factoraos_crm_sync_events;
create policy "admin_insert_factoraos_crm_sync_events"
  on public.factoraos_crm_sync_events for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_factoraos_crm_sync_events" on public.factoraos_crm_sync_events;
create policy "admin_update_factoraos_crm_sync_events"
  on public.factoraos_crm_sync_events for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
