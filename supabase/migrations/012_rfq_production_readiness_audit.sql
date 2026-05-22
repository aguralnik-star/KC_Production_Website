-- K&C Design and Manufacturing — RFQ production readiness audit and QA checklist
-- Run after 011_add_customer_additional_info_file_upload.sql

create table if not exists public.rfq_production_readiness_audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  audit_name text not null,
  audit_version text not null default '1.0',
  overall_status text not null default 'pending',
  completion_percentage numeric(5,2) default 0,
  notes text,
  constraint rfq_production_readiness_audits_overall_status_check
    check (overall_status in ('pending', 'in_progress', 'passed', 'failed'))
);

create index if not exists rfq_production_readiness_audits_created_at_idx
  on public.rfq_production_readiness_audits (created_at desc);

create table if not exists public.rfq_production_readiness_checks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  audit_id uuid not null references public.rfq_production_readiness_audits(id) on delete cascade,
  category text not null,
  check_name text not null,
  check_description text,
  status text not null default 'pending',
  evidence text,
  completed_at timestamptz,
  completed_by uuid references auth.users(id),
  constraint rfq_production_readiness_checks_status_check
    check (status in ('pending', 'passed', 'failed', 'not_applicable'))
);

create index if not exists rfq_production_readiness_checks_audit_id_idx
  on public.rfq_production_readiness_checks (audit_id, category, check_name);

alter table public.rfq_production_readiness_audits enable row level security;
alter table public.rfq_production_readiness_checks enable row level security;

create policy "admin_select_rfq_production_readiness_audits"
  on public.rfq_production_readiness_audits for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_production_readiness_audits"
  on public.rfq_production_readiness_audits for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_rfq_production_readiness_audits"
  on public.rfq_production_readiness_audits for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_select_rfq_production_readiness_checks"
  on public.rfq_production_readiness_checks for select to authenticated
  using (public.is_admin());

create policy "admin_insert_rfq_production_readiness_checks"
  on public.rfq_production_readiness_checks for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_rfq_production_readiness_checks"
  on public.rfq_production_readiness_checks for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
