-- K&C Design and Manufacturing — RFQ production monitoring command center views
-- Run after 012_rfq_production_readiness_audit.sql

alter table public.rfq_requests
  add column if not exists quote_amount numeric(12,2),
  add column if not exists won_amount numeric(12,2);

create or replace view public.rfq_operations_summary_view
with (security_invoker = true)
as
select
  (
    select count(*)
    from public.rfq_requests r
    where r.created_at >= date_trunc('day', timezone('utc', now()))
  ) as new_rfqs_today,
  (
    select count(*)
    from public.rfq_requests r
    where r.status not in ('won', 'lost', 'closed', 'rejected')
  ) as open_rfqs,
  (
    select count(*)
    from public.rfq_requests r
    where r.status = 'in_review'
  ) as in_review_rfqs,
  (
    select count(*)
    from public.rfq_requests r
    where r.status in ('quoted', 'follow_up_needed')
  ) as quotes_awaiting_response,
  (
    select count(*)
    from public.rfq_requests r
    where r.follow_up_status = 'overdue'
  ) as overdue_followups,
  (
    select count(*)
    from public.rfq_requests r
    where r.follow_up_status = 'due_today'
  ) as followups_due_today,
  (
    select count(*)
    from public.rfq_additional_info_requests air
    where air.status in ('sent', 'viewed')
      and air.expires_at > timezone('utc', now())
  ) as additional_info_outstanding,
  (
    select count(*)
    from public.rfq_customer_uploaded_files cuf
    where cuf.created_at >= date_trunc('day', timezone('utc', now()))
  ) as customer_reuploads_today,
  (
    select count(*)
    from public.rfq_requests r
    where r.customer_confirmation_email_status = 'failed'
  ) as failed_customer_emails,
  (
    select count(*)
    from public.rfq_customer_status_email_drafts d
    where d.status = 'failed'
  ) + (
    select count(*)
    from public.rfq_customer_status_email_events e
    where e.status = 'failed'
  ) + (
    select count(*)
    from public.rfq_requests r
    where r.last_customer_status_email_status = 'failed'
  ) as failed_status_emails,
  (
    select count(*)
    from public.rfq_additional_info_requests air
    where air.status = 'failed'
  ) as failed_additional_info_requests,
  (
    select count(*)
    from public.rfq_customer_status_lookup_events e
    where e.created_at >= date_trunc('day', timezone('utc', now()))
  ) as public_status_lookups_today,
  (
    select count(*)
    from public.rfq_customer_status_lookup_events e
    where e.created_at >= date_trunc('day', timezone('utc', now()))
      and e.lookup_success = true
  ) as successful_status_lookups_today,
  (
    select count(*)
    from public.rfq_customer_status_lookup_events e
    where e.created_at >= date_trunc('day', timezone('utc', now()))
      and e.lookup_success = false
  ) as failed_status_lookups_today,
  (
    select count(*)
    from public.rfq_requests r
    where r.status = 'won'
      and coalesce(r.updated_at, r.created_at) >= date_trunc('month', timezone('utc', now()))
  ) as won_this_month,
  (
    select count(*)
    from public.rfq_requests r
    where r.status = 'lost'
      and coalesce(r.updated_at, r.created_at) >= date_trunc('month', timezone('utc', now()))
  ) as lost_this_month,
  coalesce((
    select sum(coalesce(r.quote_amount, 0))
    from public.rfq_requests r
    where r.status in ('quote_ready', 'quoted', 'follow_up_needed')
  ), 0) as quoted_value_open,
  coalesce((
    select sum(coalesce(r.won_amount, 0))
    from public.rfq_requests r
    where r.status = 'won'
      and coalesce(r.updated_at, r.created_at) >= date_trunc('month', timezone('utc', now()))
  ), 0) as won_value_this_month;

create or replace view public.rfq_operations_alerts_view
with (security_invoker = true)
as
select
  'failed_email'::text as alert_type,
  'critical'::text as alert_level,
  r.id as rfq_request_id,
  r.reference_number,
  r.company,
  r.name,
  'Failed customer confirmation email'::text as title,
  coalesce(r.customer_confirmation_email_error, 'Customer confirmation email delivery failed.') as message,
  coalesce(r.customer_confirmation_email_sent_at, r.updated_at, r.created_at) as created_at,
  'Open RFQ'::text as action_label
from public.rfq_requests r
where r.customer_confirmation_email_status = 'failed'

union all

select
  'failed_email'::text,
  'critical'::text,
  r.id,
  r.reference_number,
  r.company,
  r.name,
  'Failed customer status email'::text,
  coalesce(r.last_customer_status_email_error, d.send_error, 'Customer status email delivery failed.') as message,
  coalesce(d.sent_at, d.updated_at, r.updated_at, r.created_at) as created_at,
  'Open RFQ'::text
from public.rfq_requests r
join public.rfq_customer_status_email_drafts d on d.rfq_request_id = r.id
where d.status = 'failed'

union all

select
  'failed_email'::text,
  'critical'::text,
  r.id,
  r.reference_number,
  r.company,
  r.name,
  'Failed additional info request email'::text,
  coalesce(air.send_error, 'Additional information request email failed to send.') as message,
  coalesce(air.sent_at, air.updated_at, air.created_at) as created_at,
  'Open RFQ'::text
from public.rfq_requests r
join public.rfq_additional_info_requests air on air.rfq_request_id = r.id
where air.status = 'failed'

union all

select
  'overdue_followup'::text,
  case
    when r.follow_up_priority in ('high', 'urgent') then 'critical'
    else 'warning'
  end as alert_level,
  r.id,
  r.reference_number,
  r.company,
  r.name,
  'Overdue follow-up'::text,
  coalesce(r.stale_reason, 'Follow-up is overdue and requires admin action.') as message,
  coalesce(r.next_follow_up_at, r.updated_at, r.created_at) as created_at,
  'Open RFQ'::text
from public.rfq_requests r
where r.follow_up_status = 'overdue'

union all

select
  'stale_new_rfq'::text,
  'warning'::text,
  r.id,
  r.reference_number,
  r.company,
  r.name,
  'Stale new RFQ'::text,
  'RFQ has remained in new status for more than 2 business days without admin review.' as message,
  r.created_at,
  'Open RFQ'::text
from public.rfq_requests r
where r.status = 'new'
  and r.created_at <= timezone('utc', now()) - interval '2 days'

union all

select
  'quote_ready_not_sent'::text,
  'warning'::text,
  r.id,
  r.reference_number,
  r.company,
  r.name,
  'Quote ready but not sent'::text,
  'RFQ is quote ready but no quote has been manually sent yet.' as message,
  coalesce(r.last_quote_draft_at, r.updated_at, r.created_at) as created_at,
  'Open RFQ'::text
from public.rfq_requests r
where r.status = 'quote_ready'
  and r.quote_manually_sent_at is null
  and r.quote_sent_at is null

union all

select
  'additional_info_expired'::text,
  'warning'::text,
  r.id,
  r.reference_number,
  r.company,
  r.name,
  'Additional info request expired'::text,
  'Customer additional information request expired before submission.' as message,
  air.expires_at as created_at,
  'Open RFQ'::text
from public.rfq_requests r
join public.rfq_additional_info_requests air on air.rfq_request_id = r.id
where air.status in ('sent', 'viewed', 'expired')
  and air.expires_at <= timezone('utc', now())
  and air.completed_at is null

union all

select
  'additional_info_outstanding'::text,
  'watch'::text,
  r.id,
  r.reference_number,
  r.company,
  r.name,
  'Additional info outstanding'::text,
  'Customer additional information request is awaiting customer response.' as message,
  coalesce(air.sent_at, air.created_at) as created_at,
  'Open RFQ'::text
from public.rfq_requests r
join public.rfq_additional_info_requests air on air.rfq_request_id = r.id
where air.status in ('sent', 'viewed')
  and air.expires_at > timezone('utc', now())

union all

select
  'customer_reupload_received'::text,
  'watch'::text,
  r.id,
  r.reference_number,
  r.company,
  r.name,
  'Customer re-upload received'::text,
  'Customer submitted additional files or notes for review.' as message,
  coalesce(r.additional_info_received_at, cis.created_at) as created_at,
  'Open RFQ'::text
from public.rfq_requests r
join public.rfq_customer_info_submissions cis on cis.rfq_request_id = r.id
where cis.created_at >= timezone('utc', now()) - interval '7 days'
  and r.status = 'in_review'

union all

select
  'lookup_failure_spike'::text,
  'warning'::text,
  null::uuid as rfq_request_id,
  null::text as reference_number,
  null::text as company,
  null::text as name,
  'Public lookup failures elevated'::text,
  'Failed public status lookups exceeded successful lookups in the last 24 hours.' as message,
  timezone('utc', now()) as created_at,
  'Review Logs'::text
where (
  select count(*)
  from public.rfq_customer_status_lookup_events e
  where e.created_at >= timezone('utc', now()) - interval '24 hours'
    and e.lookup_success = false
) > (
  select count(*)
  from public.rfq_customer_status_lookup_events e
  where e.created_at >= timezone('utc', now()) - interval '24 hours'
    and e.lookup_success = true
)
and (
  select count(*)
  from public.rfq_customer_status_lookup_events e
  where e.created_at >= timezone('utc', now()) - interval '24 hours'
    and e.lookup_success = false
) >= 3;

create or replace view public.rfq_system_health_view
with (security_invoker = true)
as
select
  (select count(*) from public.rfq_requests) as total_rfqs,
  (
    select count(*)
    from public.rfq_requests r
    where r.created_at >= timezone('utc', now()) - interval '24 hours'
  ) as rfqs_last_24h,
  (
    select count(*)
    from public.rfq_files f
    where f.created_at >= timezone('utc', now()) - interval '24 hours'
  ) as uploaded_files_last_24h,
  (
    select count(*)
    from public.rfq_customer_uploaded_files cuf
    where cuf.created_at >= timezone('utc', now()) - interval '24 hours'
  ) as customer_reuploads_last_24h,
  (
    select count(*)
    from public.rfq_requests r
    where r.customer_confirmation_email_status = 'failed'
      and coalesce(r.customer_confirmation_email_sent_at, r.updated_at, r.created_at) >= timezone('utc', now()) - interval '24 hours'
  ) + (
    select count(*)
    from public.rfq_customer_status_email_drafts d
    where d.status = 'failed'
      and coalesce(d.sent_at, d.updated_at, d.created_at) >= timezone('utc', now()) - interval '24 hours'
  ) + (
    select count(*)
    from public.rfq_customer_status_email_events e
    where e.status = 'failed'
      and e.created_at >= timezone('utc', now()) - interval '24 hours'
  ) + (
    select count(*)
    from public.rfq_additional_info_requests air
    where air.status = 'failed'
      and coalesce(air.sent_at, air.updated_at, air.created_at) >= timezone('utc', now()) - interval '24 hours'
  ) as failed_email_count_last_24h,
  (
    select count(*)
    from public.rfq_customer_status_lookup_events e
    where e.created_at >= timezone('utc', now()) - interval '24 hours'
  ) as lookup_events_last_24h,
  (
    select count(*)
    from public.rfq_customer_status_lookup_events e
    where e.created_at >= timezone('utc', now()) - interval '24 hours'
      and e.lookup_success = false
  ) as failed_lookup_events_last_24h,
  (
    select count(*)
    from public.rfq_operations_alerts_view a
  ) as open_alert_count,
  (
    select count(*)
    from public.rfq_operations_alerts_view a
    where a.alert_level = 'critical'
  ) as critical_alert_count,
  (select max(r.created_at) from public.rfq_requests r) as latest_rfq_created_at,
  (select max(cuf.created_at) from public.rfq_customer_uploaded_files cuf) as latest_customer_reupload_at,
  greatest(
    coalesce((select max(e.created_at) from public.rfq_customer_status_email_events e where e.status = 'sent'), to_timestamp(0)),
    coalesce((select max(d.sent_at) from public.rfq_customer_status_email_drafts d where d.status = 'sent'), to_timestamp(0)),
    coalesce((select max(air.sent_at) from public.rfq_additional_info_requests air where air.status in ('sent', 'viewed', 'submitted')), to_timestamp(0)),
    coalesce((select max(r.customer_confirmation_email_sent_at) from public.rfq_requests r where r.customer_confirmation_email_status = 'sent'), to_timestamp(0))
  ) as latest_email_sent_at;

create or replace view public.rfq_admin_activity_view
with (security_invoker = true)
as
select
  'internal_note'::text as activity_type,
  n.rfq_request_id,
  r.reference_number,
  r.company,
  n.created_by as admin_user_id,
  left(n.note, 180) as activity_summary,
  n.created_at as activity_at
from public.rfq_internal_notes n
join public.rfq_requests r on r.id = n.rfq_request_id

union all

select
  'follow_up_completed'::text,
  r.id,
  r.reference_number,
  r.company,
  null::uuid,
  'Follow-up marked completed'::text,
  coalesce(r.last_follow_up_at, r.updated_at)
from public.rfq_requests r
where r.follow_up_status = 'completed'

union all

select
  'quote_draft_created'::text,
  d.rfq_request_id,
  r.reference_number,
  r.company,
  d.created_by,
  'Quote draft created: ' || left(d.subject, 120),
  d.created_at
from public.rfq_quote_email_drafts d
join public.rfq_requests r on r.id = d.rfq_request_id

union all

select
  'quote_manually_sent'::text,
  e.rfq_request_id,
  r.reference_number,
  r.company,
  e.sent_by,
  'Quote manually sent via ' || coalesce(e.send_method, 'manual'),
  e.sent_at
from public.rfq_manual_send_events e
join public.rfq_requests r on r.id = e.rfq_request_id

union all

select
  'status_email_sent'::text,
  e.rfq_request_id,
  r.reference_number,
  r.company,
  e.sent_by,
  'Customer status email sent: ' || left(e.subject, 120),
  e.created_at
from public.rfq_customer_status_email_events e
join public.rfq_requests r on r.id = e.rfq_request_id
where e.status = 'sent'

union all

select
  'additional_info_request_sent'::text,
  air.rfq_request_id,
  r.reference_number,
  r.company,
  air.sent_by,
  'Additional info request sent: ' || left(air.subject, 120),
  air.sent_at
from public.rfq_additional_info_requests air
join public.rfq_requests r on r.id = air.rfq_request_id
where air.sent_at is not null

union all

select
  'readiness_check_updated'::text,
  null::uuid,
  null::text,
  null::text,
  c.completed_by,
  c.category || ': ' || c.check_name || ' marked ' || c.status,
  coalesce(c.completed_at, c.created_at)
from public.rfq_production_readiness_checks c
where c.status in ('passed', 'failed', 'not_applicable');

grant select on public.rfq_operations_summary_view to authenticated;
grant select on public.rfq_operations_alerts_view to authenticated;
grant select on public.rfq_system_health_view to authenticated;
grant select on public.rfq_admin_activity_view to authenticated;
