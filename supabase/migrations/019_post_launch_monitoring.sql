-- K&C Design and Manufacturing — post-launch 7-day monitoring
-- Run after 018_seed_launch_admin_profile.sql
-- Note: requested as 014_post_launch_monitoring.sql but 014 is launch_checklist_items.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.post_launch_daily_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  review_date date not null,
  reviewer_id uuid references auth.users(id),
  traffic_summary text,
  rfq_summary text,
  issues_found text,
  actions_taken text,
  overall_status text not null default 'healthy',
  constraint post_launch_daily_reviews_status_check
    check (overall_status in ('healthy', 'attention_needed', 'critical'))
);

create unique index if not exists post_launch_daily_reviews_date_idx
  on public.post_launch_daily_reviews (review_date);

create table if not exists public.post_launch_issues (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  description text,
  severity text not null default 'medium',
  status text not null default 'open',
  assigned_to uuid references auth.users(id),
  resolved_at timestamptz,
  created_by uuid references auth.users(id),
  constraint post_launch_issues_severity_check
    check (severity in ('low', 'medium', 'high', 'critical')),
  constraint post_launch_issues_status_check
    check (status in ('open', 'investigating', 'resolved'))
);

create index if not exists post_launch_issues_status_idx
  on public.post_launch_issues (status, severity, created_at desc);

create or replace function public.set_post_launch_issues_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if new.status = 'resolved' and new.resolved_at is null then
    new.resolved_at = now();
  elsif new.status <> 'resolved' then
    new.resolved_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists post_launch_issues_updated_at on public.post_launch_issues;

create trigger post_launch_issues_updated_at
  before update on public.post_launch_issues
  for each row
  execute function public.set_post_launch_issues_updated_at();

-- ---------------------------------------------------------------------------
-- Views
-- ---------------------------------------------------------------------------

create or replace view public.post_launch_kpi_summary_view
with (security_invoker = true)
as
select
  (
    select count(*)
    from public.rfq_requests r
    where r.created_at >= date_trunc('day', timezone('utc', now()))
  ) as rfqs_today,
  (
    select count(*)
    from public.rfq_requests r
    where r.created_at >= timezone('utc', now()) - interval '7 days'
  ) as rfqs_last_7_days,
  (
    select count(*)
    from public.rfq_requests r
    where r.status in ('won', 'lost', 'closed')
      and r.created_at >= timezone('utc', now()) - interval '7 days'
  ) as completed_rfqs,
  (
    select count(*)
    from public.rfq_requests r
    where r.status in ('quote_ready', 'quoted', 'follow_up_needed')
  ) as quote_requests,
  coalesce((
    select round(
      100.0 * count(*) filter (where r.status in ('quoted', 'quote_ready', 'follow_up_needed', 'won'))
      / nullif(count(*), 0),
      1
    )
    from public.rfq_requests r
    where r.created_at >= timezone('utc', now()) - interval '7 days'
  ), 0) as quote_conversion_rate,
  coalesce((
    select round(avg(extract(epoch from (e.sent_at - r.created_at)) / 3600.0)::numeric, 1)
    from public.rfq_requests r
    join lateral (
      select min(m.sent_at) as sent_at
      from public.rfq_manual_send_events m
      where m.rfq_request_id = r.id
    ) e on e.sent_at is not null
    where r.created_at >= timezone('utc', now()) - interval '7 days'
  ), 0) as avg_response_time,
  (
    select count(*)
    from public.rfq_customer_status_lookup_events e
    where e.created_at >= timezone('utc', now()) - interval '7 days'
  ) as public_status_lookups,
  (
    select count(*)
    from public.rfq_additional_info_requests air
    where air.created_at >= timezone('utc', now()) - interval '7 days'
  ) as additional_info_requests,
  (
    select count(*)
    from public.rfq_customer_uploaded_files cuf
    where cuf.created_at >= timezone('utc', now()) - interval '7 days'
  ) as customer_reuploads,
  (
    select count(*)
    from public.rfq_requests r
    where r.customer_confirmation_email_status = 'failed'
  ) + (
    select count(*)
    from public.rfq_customer_status_email_drafts d
    where d.status = 'failed'
  ) + (
    select count(*)
    from public.rfq_customer_status_email_events e
    where e.status = 'failed'
  ) + (
    select count(*)
    from public.rfq_additional_info_requests air
    where air.status = 'failed'
  ) as failed_emails,
  (
    select count(*)
    from public.post_launch_issues i
    where i.status in ('open', 'investigating')
  ) as open_issues,
  (
    select count(*)
    from public.post_launch_issues i
    where i.status in ('open', 'investigating')
      and i.severity = 'critical'
  ) as critical_issues;

create or replace view public.post_launch_conversion_funnel_view
with (security_invoker = true)
as
select
  0::bigint as visitors,
  (
    select count(*)
    from public.rfq_requests r
    where r.created_at >= timezone('utc', now()) - interval '7 days'
  ) as rfq_starts,
  (
    select count(*)
    from public.rfq_requests r
    where r.created_at >= timezone('utc', now()) - interval '7 days'
  ) as rfq_submissions,
  (
    select count(*)
    from public.rfq_manual_send_events e
    where e.sent_at >= timezone('utc', now()) - interval '7 days'
  ) as quotes_sent,
  (
    select count(*)
    from public.rfq_requests r
    where r.status in ('quote_ready', 'quoted', 'follow_up_needed', 'in_review', 'new')
  ) as opportunities_open,
  (
    select count(*)
    from public.rfq_requests r
    where r.status = 'won'
      and coalesce(r.updated_at, r.created_at) >= timezone('utc', now()) - interval '7 days'
  ) as projects_won;

create or replace view public.post_launch_activity_view
with (security_invoker = true)
as
select
  'rfq_received'::text as activity_type,
  r.id as rfq_request_id,
  r.reference_number,
  r.company,
  null::uuid as actor_id,
  ('RFQ received from ' || coalesce(r.company, r.name))::text as activity_summary,
  r.created_at as activity_at
from public.rfq_requests r
where r.created_at >= timezone('utc', now()) - interval '7 days'

union all

select
  'status_updated'::text,
  r.id,
  r.reference_number,
  r.company,
  null::uuid,
  ('Status updated to ' || r.status)::text,
  coalesce(r.updated_at, r.created_at)
from public.rfq_requests r
where r.updated_at >= timezone('utc', now()) - interval '7 days'
  and r.updated_at is not null
  and r.updated_at > r.created_at + interval '1 minute'

union all

select
  a.activity_type,
  a.rfq_request_id,
  a.reference_number,
  a.company,
  a.admin_user_id,
  a.activity_summary,
  a.activity_at
from public.rfq_admin_activity_view a
where a.activity_at >= timezone('utc', now()) - interval '7 days'

union all

select
  'issue_created'::text,
  null::uuid,
  null::text,
  null::text,
  i.created_by,
  ('Issue opened: ' || i.title)::text,
  i.created_at
from public.post_launch_issues i
where i.created_at >= timezone('utc', now()) - interval '7 days'

union all

select
  'issue_resolved'::text,
  null::uuid,
  null::text,
  null::text,
  i.assigned_to,
  ('Issue resolved: ' || i.title)::text,
  i.resolved_at
from public.post_launch_issues i
where i.status = 'resolved'
  and i.resolved_at >= timezone('utc', now()) - interval '7 days';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.post_launch_daily_reviews enable row level security;
alter table public.post_launch_issues enable row level security;

drop policy if exists "admin_select_post_launch_daily_reviews" on public.post_launch_daily_reviews;
create policy "admin_select_post_launch_daily_reviews"
  on public.post_launch_daily_reviews for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_post_launch_daily_reviews" on public.post_launch_daily_reviews;
create policy "admin_insert_post_launch_daily_reviews"
  on public.post_launch_daily_reviews for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_post_launch_daily_reviews" on public.post_launch_daily_reviews;
create policy "admin_update_post_launch_daily_reviews"
  on public.post_launch_daily_reviews for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_select_post_launch_issues" on public.post_launch_issues;
create policy "admin_select_post_launch_issues"
  on public.post_launch_issues for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_post_launch_issues" on public.post_launch_issues;
create policy "admin_insert_post_launch_issues"
  on public.post_launch_issues for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_post_launch_issues" on public.post_launch_issues;
create policy "admin_update_post_launch_issues"
  on public.post_launch_issues for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_post_launch_issues" on public.post_launch_issues;
create policy "admin_delete_post_launch_issues"
  on public.post_launch_issues for delete to authenticated
  using (public.is_admin());

grant select on public.post_launch_kpi_summary_view to authenticated;
grant select on public.post_launch_conversion_funnel_view to authenticated;
grant select on public.post_launch_activity_view to authenticated;
