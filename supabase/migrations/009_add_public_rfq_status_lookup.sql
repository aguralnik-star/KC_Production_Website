-- K&C Design and Manufacturing — public RFQ status lookup
-- Run after 008_add_rfq_customer_confirmation_email_tracking.sql

alter table public.rfq_requests
  add column if not exists public_status text not null default 'received',
  add column if not exists customer_status_message text,
  add column if not exists last_customer_status_viewed_at timestamptz;

alter table public.rfq_requests
  drop constraint if exists rfq_requests_public_status_check;

alter table public.rfq_requests
  add constraint rfq_requests_public_status_check
  check (public_status in (
    'received',
    'under_review',
    'additional_info_needed',
    'quote_in_progress',
    'quote_sent',
    'completed',
    'closed'
  ));

create or replace function public.map_internal_status_to_public_status(internal_status text)
returns text
language plpgsql
immutable
as $$
begin
  return case internal_status
    when 'new' then 'received'
    when 'in_review' then 'under_review'
    when 'waiting_on_customer' then 'additional_info_needed'
    when 'quote_ready' then 'quote_in_progress'
    when 'quoted' then 'quote_sent'
    when 'follow_up_needed' then 'quote_sent'
    when 'won' then 'completed'
    when 'lost' then 'closed'
    when 'closed' then 'closed'
    when 'rejected' then 'closed'
    else 'received'
  end;
end;
$$;

update public.rfq_requests
set public_status = public.map_internal_status_to_public_status(status)
where public_status = 'received'
  and status is not null
  and status <> 'new';

create table if not exists public.rfq_customer_status_lookup_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reference_number text,
  email text,
  matched_rfq_request_id uuid references public.rfq_requests(id) on delete set null,
  lookup_success boolean not null default false,
  client_ip text,
  user_agent text
);

create index if not exists rfq_customer_status_lookup_events_created_at_idx
  on public.rfq_customer_status_lookup_events (created_at desc);

alter table public.rfq_customer_status_lookup_events enable row level security;

create policy "admin_select_rfq_customer_status_lookup_events"
  on public.rfq_customer_status_lookup_events for select to authenticated
  using (public.is_admin());

grant execute on function public.map_internal_status_to_public_status(text) to authenticated;
