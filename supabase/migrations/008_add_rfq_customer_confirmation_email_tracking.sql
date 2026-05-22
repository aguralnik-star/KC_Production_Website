-- K&C Design and Manufacturing — customer RFQ confirmation email tracking
-- Run after 007_add_rfq_reference_number.sql

alter table public.rfq_requests
  add column if not exists customer_confirmation_email_sent_at timestamptz,
  add column if not exists customer_confirmation_email_status text not null default 'not_sent',
  add column if not exists customer_confirmation_email_error text;

alter table public.rfq_requests
  drop constraint if exists rfq_requests_customer_confirmation_email_status_check;

alter table public.rfq_requests
  add constraint rfq_requests_customer_confirmation_email_status_check
  check (customer_confirmation_email_status in ('not_sent', 'sent', 'failed'));
