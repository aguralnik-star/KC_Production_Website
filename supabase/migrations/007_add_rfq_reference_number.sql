-- K&C Design and Manufacturing — RFQ customer reference numbers
-- Run after 005_add_rfq_followup_reminder_queue.sql

alter table public.rfq_requests
  add column if not exists reference_number text,
  add column if not exists submitted_at timestamptz default now(),
  add column if not exists customer_confirmation_viewed_at timestamptz;

create unique index if not exists rfq_requests_reference_number_unique_idx
  on public.rfq_requests (reference_number)
  where reference_number is not null;

create or replace function public.generate_rfq_reference_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  today_text text := to_char(current_date, 'YYYYMMDD');
  prefix text := 'KC-RFQ-' || today_text || '-';
  next_seq integer;
begin
  perform pg_advisory_xact_lock(hashtext('rfq_reference_' || today_text));

  select coalesce(
    max(nullif(split_part(reference_number, '-', 4), '')::integer),
    0
  ) + 1
  into next_seq
  from public.rfq_requests
  where reference_number like prefix || '%';

  return prefix || lpad(next_seq::text, 4, '0');
end;
$$;

create or replace function public.rfq_requests_before_insert_trigger()
returns trigger
language plpgsql
as $$
begin
  if new.submitted_at is null then
    new.submitted_at := now();
  end if;

  if new.reference_number is null or btrim(new.reference_number) = '' then
    new.reference_number := public.generate_rfq_reference_number();
  end if;

  return new;
end;
$$;

drop trigger if exists rfq_requests_before_insert_defaults on public.rfq_requests;

create trigger rfq_requests_before_insert_defaults
  before insert on public.rfq_requests
  for each row
  execute function public.rfq_requests_before_insert_trigger();

create or replace function public.rfq_requests_after_insert_note()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.rfq_internal_notes (rfq_request_id, note)
  values (new.id, 'Customer confirmation page generated.');
  return new;
end;
$$;

drop trigger if exists rfq_requests_after_insert_note on public.rfq_requests;

create trigger rfq_requests_after_insert_note
  after insert on public.rfq_requests
  for each row
  execute function public.rfq_requests_after_insert_note();
