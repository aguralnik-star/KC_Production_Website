-- K&C Design and Manufacturing — customer additional info and file re-upload workflow
-- Run after 010_add_customer_status_update_email_workflow.sql

alter table public.rfq_requests
  add column if not exists additional_info_requested_at timestamptz,
  add column if not exists additional_info_due_at timestamptz,
  add column if not exists additional_info_received_at timestamptz,
  add column if not exists additional_info_request_count integer not null default 0,
  add column if not exists has_customer_reupload boolean not null default false;

create table if not exists public.rfq_additional_info_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  created_by uuid references auth.users(id),
  request_token text not null unique,
  request_type text not null default 'files_and_notes',
  status text not null default 'draft',
  subject text not null,
  message text not null,
  requested_items text,
  expires_at timestamptz not null,
  sent_at timestamptz,
  sent_by uuid references auth.users(id),
  completed_at timestamptz,
  customer_email text,
  resend_email_id text,
  send_error text,
  constraint rfq_additional_info_requests_request_type_check
    check (request_type in (
      'files_only',
      'notes_only',
      'files_and_notes',
      'drawing_revision',
      'missing_details',
      'tolerance_clarification',
      'material_clarification',
      'quantity_clarification'
    )),
  constraint rfq_additional_info_requests_status_check
    check (status in ('draft', 'sent', 'viewed', 'submitted', 'expired', 'canceled', 'failed'))
);

create index if not exists rfq_additional_info_requests_rfq_id_idx
  on public.rfq_additional_info_requests (rfq_request_id, created_at desc);

create index if not exists rfq_additional_info_requests_token_idx
  on public.rfq_additional_info_requests (request_token);

create table if not exists public.rfq_customer_info_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  additional_info_request_id uuid not null references public.rfq_additional_info_requests(id) on delete cascade,
  customer_name text,
  customer_email text,
  notes text,
  submitted_from_ip text,
  user_agent text
);

create index if not exists rfq_customer_info_submissions_request_id_idx
  on public.rfq_customer_info_submissions (additional_info_request_id, created_at desc);

create table if not exists public.rfq_customer_uploaded_files (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  additional_info_request_id uuid references public.rfq_additional_info_requests(id) on delete cascade,
  customer_info_submission_id uuid references public.rfq_customer_info_submissions(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint,
  uploaded_by_email text
);

create index if not exists rfq_customer_uploaded_files_request_id_idx
  on public.rfq_customer_uploaded_files (rfq_request_id, created_at desc);

create or replace function public.set_rfq_additional_info_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rfq_additional_info_requests_updated_at on public.rfq_additional_info_requests;

create trigger rfq_additional_info_requests_updated_at
  before update on public.rfq_additional_info_requests
  for each row
  execute function public.set_rfq_additional_info_requests_updated_at();

alter table public.rfq_additional_info_requests enable row level security;
alter table public.rfq_customer_info_submissions enable row level security;
alter table public.rfq_customer_uploaded_files enable row level security;

create policy "admin_select_rfq_additional_info_requests"
  on public.rfq_additional_info_requests for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_additional_info_requests"
  on public.rfq_additional_info_requests for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_rfq_additional_info_requests"
  on public.rfq_additional_info_requests for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_select_rfq_customer_info_submissions"
  on public.rfq_customer_info_submissions for select to authenticated
  using (public.is_admin());

create policy "admin_select_rfq_customer_uploaded_files"
  on public.rfq_customer_uploaded_files for select to authenticated
  using (public.is_admin());
