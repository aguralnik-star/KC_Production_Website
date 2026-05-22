-- K&C Design and Manufacturing — customer status update email workflow
-- Run after 009_add_public_rfq_status_lookup.sql

alter table public.rfq_requests
  add column if not exists last_customer_status_email_sent_at timestamptz,
  add column if not exists last_customer_status_email_status text,
  add column if not exists last_customer_status_email_error text;

create table if not exists public.rfq_customer_status_email_drafts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  created_by uuid references auth.users(id),
  public_status text not null,
  subject text not null,
  body text not null,
  status text not null default 'draft',
  sent_at timestamptz,
  sent_by uuid references auth.users(id),
  resend_email_id text,
  send_error text,
  constraint rfq_customer_status_email_drafts_public_status_check
    check (public_status in (
      'received',
      'under_review',
      'additional_info_needed',
      'quote_in_progress',
      'quote_sent',
      'completed',
      'closed'
    )),
  constraint rfq_customer_status_email_drafts_status_check
    check (status in ('draft', 'ready', 'sent', 'failed', 'archived'))
);

create index if not exists rfq_customer_status_email_drafts_request_id_idx
  on public.rfq_customer_status_email_drafts (rfq_request_id, created_at desc);

create table if not exists public.rfq_customer_status_email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  draft_id uuid references public.rfq_customer_status_email_drafts(id) on delete set null,
  sent_by uuid references auth.users(id),
  sent_to_email text not null,
  subject text not null,
  public_status text not null,
  resend_email_id text,
  status text not null default 'sent',
  error_message text,
  constraint rfq_customer_status_email_events_status_check
    check (status in ('sent', 'failed'))
);

create index if not exists rfq_customer_status_email_events_request_id_idx
  on public.rfq_customer_status_email_events (rfq_request_id, created_at desc);

create or replace function public.set_rfq_customer_status_email_drafts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rfq_customer_status_email_drafts_updated_at on public.rfq_customer_status_email_drafts;

create trigger rfq_customer_status_email_drafts_updated_at
  before update on public.rfq_customer_status_email_drafts
  for each row
  execute function public.set_rfq_customer_status_email_drafts_updated_at();

alter table public.rfq_customer_status_email_drafts enable row level security;
alter table public.rfq_customer_status_email_events enable row level security;

create policy "admin_select_rfq_customer_status_email_drafts"
  on public.rfq_customer_status_email_drafts for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_customer_status_email_drafts"
  on public.rfq_customer_status_email_drafts for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_rfq_customer_status_email_drafts"
  on public.rfq_customer_status_email_drafts for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_select_rfq_customer_status_email_events"
  on public.rfq_customer_status_email_events for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_customer_status_email_events"
  on public.rfq_customer_status_email_events for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_rfq_customer_status_email_events"
  on public.rfq_customer_status_email_events for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
