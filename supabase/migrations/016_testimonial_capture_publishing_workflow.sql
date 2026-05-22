-- K&C Design and Manufacturing — testimonial capture & publishing workflow
-- Run after 015_case_study_photo_upload_workflow.sql

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  source_type text not null default 'real',
  status text not null default 'draft',
  quote text not null,
  customer_name text,
  customer_company text,
  customer_role text,
  approved_display_name text,
  approved_company_display text,
  approved_role_display text,
  display_mode text not null default 'anonymous',
  industry text,
  related_service text,
  approval_received boolean not null default false,
  approval_date date,
  approval_method text,
  allowed_usage text[] not null default '{}',
  confidentiality_review_complete boolean not null default false,
  approved_for_public_use boolean not null default false,
  published_at timestamptz,
  internal_notes text,
  constraint testimonials_status_check
    check (status in ('draft', 'pending_approval', 'approved', 'published', 'needs_revision', 'rejected', 'archived')),
  constraint testimonials_source_type_check
    check (source_type in ('representative', 'real')),
  constraint testimonials_display_mode_check
    check (display_mode in (
      'anonymous',
      'display_name_only',
      'company_only',
      'role_only',
      'name_and_company',
      'name_company_and_role'
    )),
  constraint testimonials_approval_method_check
    check (approval_method is null or approval_method in ('email', 'signed_form', 'verbal', 'other'))
);

create index if not exists testimonials_status_idx
  on public.testimonials (status, published_at desc nulls last);

create table if not exists public.testimonial_approval_checklists (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  testimonial_id uuid not null references public.testimonials(id) on delete cascade,
  checklist_item text not null,
  category text not null,
  status text not null default 'pending',
  evidence text,
  completed_at timestamptz,
  completed_by uuid references auth.users(id),
  constraint testimonial_approval_checklists_status_check
    check (status in ('pending', 'passed', 'failed', 'not_applicable'))
);

create index if not exists testimonial_approval_checklists_testimonial_idx
  on public.testimonial_approval_checklists (testimonial_id, category, created_at);

create table if not exists public.testimonial_request_templates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  template_name text not null,
  subject text not null,
  body text not null,
  is_default boolean not null default false
);

create table if not exists public.testimonial_request_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  customer_name text,
  customer_company text,
  customer_email text,
  subject text,
  request_body text,
  status text not null default 'draft',
  sent_at timestamptz,
  notes text,
  constraint testimonial_request_logs_status_check
    check (status in ('draft', 'copied', 'sent_manually', 'received', 'canceled'))
);

create index if not exists testimonial_request_logs_created_idx
  on public.testimonial_request_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_testimonials_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists testimonials_updated_at on public.testimonials;

create trigger testimonials_updated_at
  before update on public.testimonials
  for each row
  execute function public.set_testimonials_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.testimonials enable row level security;
alter table public.testimonial_approval_checklists enable row level security;
alter table public.testimonial_request_templates enable row level security;
alter table public.testimonial_request_logs enable row level security;

drop policy if exists "admin_select_testimonials" on public.testimonials;
create policy "admin_select_testimonials"
  on public.testimonials for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_testimonials" on public.testimonials;
create policy "admin_insert_testimonials"
  on public.testimonials for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_testimonials" on public.testimonials;
create policy "admin_update_testimonials"
  on public.testimonials for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_testimonials" on public.testimonials;
create policy "admin_delete_testimonials"
  on public.testimonials for delete to authenticated
  using (public.is_admin());

drop policy if exists "public_select_published_testimonials" on public.testimonials;
create policy "public_select_published_testimonials"
  on public.testimonials for select to anon, authenticated
  using (
    status = 'published'
    and approved_for_public_use = true
    and approval_received = true
    and confidentiality_review_complete = true
  );

drop policy if exists "admin_select_testimonial_checklists" on public.testimonial_approval_checklists;
create policy "admin_select_testimonial_checklists"
  on public.testimonial_approval_checklists for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_testimonial_checklists" on public.testimonial_approval_checklists;
create policy "admin_insert_testimonial_checklists"
  on public.testimonial_approval_checklists for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_testimonial_checklists" on public.testimonial_approval_checklists;
create policy "admin_update_testimonial_checklists"
  on public.testimonial_approval_checklists for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_testimonial_checklists" on public.testimonial_approval_checklists;
create policy "admin_delete_testimonial_checklists"
  on public.testimonial_approval_checklists for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_testimonial_templates" on public.testimonial_request_templates;
create policy "admin_select_testimonial_templates"
  on public.testimonial_request_templates for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_testimonial_templates" on public.testimonial_request_templates;
create policy "admin_insert_testimonial_templates"
  on public.testimonial_request_templates for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_testimonial_templates" on public.testimonial_request_templates;
create policy "admin_update_testimonial_templates"
  on public.testimonial_request_templates for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_testimonial_templates" on public.testimonial_request_templates;
create policy "admin_delete_testimonial_templates"
  on public.testimonial_request_templates for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_testimonial_request_logs" on public.testimonial_request_logs;
create policy "admin_select_testimonial_request_logs"
  on public.testimonial_request_logs for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_testimonial_request_logs" on public.testimonial_request_logs;
create policy "admin_insert_testimonial_request_logs"
  on public.testimonial_request_logs for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_testimonial_request_logs" on public.testimonial_request_logs;
create policy "admin_update_testimonial_request_logs"
  on public.testimonial_request_logs for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_testimonial_request_logs" on public.testimonial_request_logs;
create policy "admin_delete_testimonial_request_logs"
  on public.testimonial_request_logs for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Default request template
-- ---------------------------------------------------------------------------

insert into public.testimonial_request_templates (template_name, subject, body, is_default)
select
  'Default Testimonial Request',
  'Request for Testimonial Approval - K&C Design and Manufacturing',
  E'Hi {customer_name},\n\nThank you for working with K&C Design and Manufacturing.\n\nWe are updating our website and would appreciate your permission to use a short testimonial about your experience with K&C.\n\nIf you are comfortable providing a testimonial, you can reply with a short statement about your experience related to quality, communication, responsiveness, machining support, tooling, fixtures, gauges, or overall service.\n\nWe will not publish your name, company name, project details, photos, or quote unless you approve the final wording and display format.\n\nPossible display options:\n- Anonymous testimonial\n- First name only\n- Role/title only\n- Company name only\n- Name and company, if approved\n\nThank you,\nK&C Design and Manufacturing\n422 S. Irmen Drive\nAddison, IL 60101\nPhone: (630) 543-3386\nEmail: info@kcdesignmfg.com',
  true
where not exists (
  select 1 from public.testimonial_request_templates where is_default = true
);
