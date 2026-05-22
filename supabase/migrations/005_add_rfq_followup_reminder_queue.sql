-- K&C Design and Manufacturing — RFQ follow-up reminder queue and overdue alerts
-- Run after 004_add_quote_email_drafts_manual_send_tracking.sql

-- ---------------------------------------------------------------------------
-- Extend rfq_requests
-- ---------------------------------------------------------------------------

alter table public.rfq_requests
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists expected_close_date date,
  add column if not exists follow_up_status text not null default 'none',
  add column if not exists follow_up_priority text not null default 'normal',
  add column if not exists overdue_alert_level text not null default 'none',
  add column if not exists stale_reason text,
  add column if not exists last_admin_touch_at timestamptz,
  add column if not exists last_alert_generated_at timestamptz,
  add column if not exists follow_up_reminder_dismissed_until date;

alter table public.rfq_requests
  drop constraint if exists rfq_requests_follow_up_status_check;

alter table public.rfq_requests
  add constraint rfq_requests_follow_up_status_check
  check (follow_up_status in ('none', 'scheduled', 'due_today', 'overdue', 'completed', 'dismissed'));

alter table public.rfq_requests
  drop constraint if exists rfq_requests_follow_up_priority_check;

alter table public.rfq_requests
  add constraint rfq_requests_follow_up_priority_check
  check (follow_up_priority in ('low', 'normal', 'high', 'urgent'));

alter table public.rfq_requests
  drop constraint if exists rfq_requests_overdue_alert_level_check;

alter table public.rfq_requests
  add constraint rfq_requests_overdue_alert_level_check
  check (overdue_alert_level in ('none', 'watch', 'warning', 'critical'));

create or replace function public.set_rfq_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rfq_requests_updated_at on public.rfq_requests;

create trigger rfq_requests_updated_at
  before update on public.rfq_requests
  for each row
  execute function public.set_rfq_requests_updated_at();

-- ---------------------------------------------------------------------------
-- rfq_alerts
-- ---------------------------------------------------------------------------

create table if not exists public.rfq_alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  alert_type text not null,
  alert_level text not null default 'watch',
  title text not null,
  message text not null,
  status text not null default 'open',
  dismissed_at timestamptz,
  dismissed_by uuid references auth.users(id),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id),
  constraint rfq_alerts_alert_type_check
    check (alert_type in (
      'follow_up_due_today',
      'follow_up_overdue',
      'stale_new_rfq',
      'stale_in_review',
      'quote_not_sent',
      'customer_waiting',
      'quote_response_overdue'
    )),
  constraint rfq_alerts_alert_level_check
    check (alert_level in ('watch', 'warning', 'critical')),
  constraint rfq_alerts_status_check
    check (status in ('open', 'dismissed', 'resolved'))
);

create index if not exists rfq_alerts_request_id_idx on public.rfq_alerts (rfq_request_id, created_at desc);
create index if not exists rfq_alerts_open_idx on public.rfq_alerts (status) where status = 'open';

alter table public.rfq_alerts enable row level security;

create policy "admin_select_rfq_alerts"
  on public.rfq_alerts for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_alerts"
  on public.rfq_alerts for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_rfq_alerts"
  on public.rfq_alerts for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Helper views
-- ---------------------------------------------------------------------------

create or replace view public.rfq_followup_queue_view as
select
  r.id,
  r.company,
  r.name,
  r.email,
  r.project_type,
  r.material,
  r.quantity,
  r.status,
  r.follow_up_priority as priority,
  r.quote_sent_at,
  r.next_follow_up_at,
  r.last_follow_up_at,
  r.expected_close_date,
  r.follow_up_status,
  r.follow_up_priority,
  r.overdue_alert_level,
  r.follow_up_reminder_dismissed_until,
  case
    when r.next_follow_up_at is null then null
    else (r.next_follow_up_at::date - current_date)
  end as days_until_follow_up,
  case
    when r.next_follow_up_at is not null and r.next_follow_up_at::date < current_date
      then (current_date - r.next_follow_up_at::date)
    else 0
  end as days_overdue,
  case
    when r.status in ('closed', 'won', 'lost', 'rejected') then 'closed'
    when r.follow_up_reminder_dismissed_until is not null
      and r.follow_up_reminder_dismissed_until >= current_date then 'closed'
    when r.next_follow_up_at is null then 'no_follow_up'
    when r.next_follow_up_at::date < current_date then 'overdue'
    when r.next_follow_up_at::date = current_date then 'due_today'
    else 'upcoming'
  end as computed_queue_bucket
from public.rfq_requests r;

create or replace view public.rfq_overdue_alerts_view as
select
  r.id as rfq_request_id,
  r.company,
  r.name,
  r.email,
  r.status,
  r.created_at,
  r.updated_at,
  r.quote_sent_at,
  r.next_follow_up_at,
  'stale_new_rfq'::text as alert_type,
  'warning'::text as alert_level,
  'Stale New RFQ'::text as title,
  'New RFQ has been open for more than 2 business days without review.'::text as message
from public.rfq_requests r
where r.status = 'new'
  and r.created_at < (now() - interval '2 days')

union all

select
  r.id,
  r.company,
  r.name,
  r.email,
  r.status,
  r.created_at,
  r.updated_at,
  r.quote_sent_at,
  r.next_follow_up_at,
  'stale_in_review',
  'warning',
  'Stale In-Review RFQ',
  'RFQ has remained in review for more than 5 business days.'
from public.rfq_requests r
where r.status = 'in_review'
  and r.updated_at < (now() - interval '5 days')

union all

select
  r.id,
  r.company,
  r.name,
  r.email,
  r.status,
  r.created_at,
  r.updated_at,
  r.quote_sent_at,
  r.next_follow_up_at,
  'quote_not_sent',
  'critical',
  'Quote Ready But Not Sent',
  'Quote-ready RFQ has not been manually sent within 2 business days.'
from public.rfq_requests r
where r.status = 'quote_ready'
  and r.quote_sent_at is null
  and r.updated_at < (now() - interval '2 days')

union all

select
  r.id,
  r.company,
  r.name,
  r.email,
  r.status,
  r.created_at,
  r.updated_at,
  r.quote_sent_at,
  r.next_follow_up_at,
  'follow_up_overdue',
  'critical',
  'Follow-Up Overdue',
  'Scheduled follow-up date has passed and requires attention.'
from public.rfq_requests r
where r.next_follow_up_at is not null
  and r.next_follow_up_at::date < current_date
  and r.status not in ('won', 'lost', 'closed', 'rejected')

union all

select
  r.id,
  r.company,
  r.name,
  r.email,
  r.status,
  r.created_at,
  r.updated_at,
  r.quote_sent_at,
  r.next_follow_up_at,
  'follow_up_due_today',
  'watch',
  'Follow-Up Due Today',
  'A follow-up is scheduled for today.'
from public.rfq_requests r
where r.next_follow_up_at is not null
  and r.next_follow_up_at::date = current_date
  and r.status not in ('won', 'lost', 'closed', 'rejected')

union all

select
  r.id,
  r.company,
  r.name,
  r.email,
  r.status,
  r.created_at,
  r.updated_at,
  r.quote_sent_at,
  r.next_follow_up_at,
  'customer_waiting',
  'warning',
  'Customer Waiting',
  'RFQ has been waiting on customer response for more than 7 business days.'
from public.rfq_requests r
where r.status = 'waiting_on_customer'
  and r.updated_at < (now() - interval '7 days');

grant select on public.rfq_followup_queue_view to authenticated;
grant select on public.rfq_overdue_alerts_view to authenticated;
