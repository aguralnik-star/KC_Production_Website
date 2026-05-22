-- K&C Design and Manufacturing — Quote email drafts and manual send tracking
-- Run after 002_create_admin_profiles_and_rfq_policies.sql

-- ---------------------------------------------------------------------------
-- Extend rfq_requests
-- ---------------------------------------------------------------------------

alter table public.rfq_requests
  add column if not exists quote_email_draft_count integer not null default 0,
  add column if not exists last_quote_draft_at timestamptz,
  add column if not exists quote_manually_sent_at timestamptz,
  add column if not exists quote_manually_sent_by uuid references auth.users(id),
  add column if not exists quote_send_method text,
  add column if not exists quote_send_notes text,
  add column if not exists quote_sent_at timestamptz,
  add column if not exists last_follow_up_at timestamptz,
  add column if not exists next_follow_up_at timestamptz;

-- ---------------------------------------------------------------------------
-- Internal notes (admin audit trail)
-- ---------------------------------------------------------------------------

create table if not exists public.rfq_internal_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  created_by uuid references auth.users(id),
  note text not null
);

create index if not exists rfq_internal_notes_request_id_idx
  on public.rfq_internal_notes (rfq_request_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Quote email drafts
-- ---------------------------------------------------------------------------

create table if not exists public.rfq_quote_email_drafts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  created_by uuid references auth.users(id),
  subject text not null,
  body text not null,
  draft_type text not null default 'initial_quote',
  status text not null default 'draft',
  copied_at timestamptz,
  manual_sent_at timestamptz,
  manual_sent_by uuid references auth.users(id),
  constraint rfq_quote_email_drafts_draft_type_check
    check (draft_type in ('initial_quote', 'quote_revision', 'follow_up', 'clarification_request', 'no_quote')),
  constraint rfq_quote_email_drafts_status_check
    check (status in ('draft', 'copied', 'manually_sent', 'archived'))
);

create index if not exists rfq_quote_email_drafts_request_id_idx
  on public.rfq_quote_email_drafts (rfq_request_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Manual send events
-- ---------------------------------------------------------------------------

create table if not exists public.rfq_manual_send_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  quote_email_draft_id uuid references public.rfq_quote_email_drafts(id) on delete set null,
  sent_by uuid references auth.users(id),
  sent_to_email text,
  sent_subject text,
  sent_at timestamptz not null default now(),
  send_method text not null default 'manual_email',
  notes text,
  constraint rfq_manual_send_events_send_method_check
    check (send_method in ('manual_email', 'outlook', 'gmail', 'phone_follow_up', 'other'))
);

create index if not exists rfq_manual_send_events_request_id_idx
  on public.rfq_manual_send_events (rfq_request_id, sent_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger for drafts
-- ---------------------------------------------------------------------------

create or replace function public.set_rfq_quote_email_drafts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rfq_quote_email_drafts_updated_at on public.rfq_quote_email_drafts;

create trigger rfq_quote_email_drafts_updated_at
  before update on public.rfq_quote_email_drafts
  for each row
  execute function public.set_rfq_quote_email_drafts_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.rfq_internal_notes enable row level security;
alter table public.rfq_quote_email_drafts enable row level security;
alter table public.rfq_manual_send_events enable row level security;

create policy "admin_select_rfq_internal_notes"
  on public.rfq_internal_notes for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_internal_notes"
  on public.rfq_internal_notes for insert to authenticated
  with check (public.is_admin());

create policy "admin_select_rfq_quote_email_drafts"
  on public.rfq_quote_email_drafts for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_quote_email_drafts"
  on public.rfq_quote_email_drafts for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_rfq_quote_email_drafts"
  on public.rfq_quote_email_drafts for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_select_rfq_manual_send_events"
  on public.rfq_manual_send_events for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_manual_send_events"
  on public.rfq_manual_send_events for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_rfq_manual_send_events"
  on public.rfq_manual_send_events for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
