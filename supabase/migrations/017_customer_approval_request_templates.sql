-- K&C Design and Manufacturing — customer approval request email templates
-- Run after 016_testimonial_capture_publishing_workflow.sql

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.customer_approval_templates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  template_type text not null,
  template_name text not null,
  subject text not null,
  body text not null,
  is_default boolean not null default false,
  constraint customer_approval_templates_type_check
    check (template_type in (
      'testimonial_request',
      'testimonial_approval',
      'case_study_request',
      'case_study_approval',
      'photo_approval',
      'final_publication_confirmation'
    ))
);

create index if not exists customer_approval_templates_type_idx
  on public.customer_approval_templates (template_type, is_default desc);

create table if not exists public.customer_approval_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  request_type text not null,
  customer_name text,
  customer_company text,
  customer_email text,
  related_testimonial_id uuid,
  related_case_study_id uuid,
  status text not null default 'draft',
  subject text,
  body text,
  approval_received boolean not null default false,
  approval_date timestamptz,
  approval_notes text,
  internal_notes text,
  constraint customer_approval_requests_type_check
    check (request_type in ('testimonial', 'case_study', 'photo', 'publication_confirmation')),
  constraint customer_approval_requests_status_check
    check (status in (
      'draft',
      'copied',
      'sent_manually',
      'awaiting_response',
      'approved',
      'declined',
      'archived'
    ))
);

create index if not exists customer_approval_requests_status_idx
  on public.customer_approval_requests (status, created_at desc);

create index if not exists customer_approval_requests_type_idx
  on public.customer_approval_requests (request_type, created_at desc);

-- Optional FKs when content workflow tables exist
DO $$
BEGIN
  IF to_regclass('public.testimonials') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_approval_requests_related_testimonial_id_fkey') THEN
    ALTER TABLE public.customer_approval_requests
      ADD CONSTRAINT customer_approval_requests_related_testimonial_id_fkey
      FOREIGN KEY (related_testimonial_id) REFERENCES public.testimonials(id) ON DELETE SET NULL;
  END IF;

  IF to_regclass('public.case_studies') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_approval_requests_related_case_study_id_fkey') THEN
    ALTER TABLE public.customer_approval_requests
      ADD CONSTRAINT customer_approval_requests_related_case_study_id_fkey
      FOREIGN KEY (related_case_study_id) REFERENCES public.case_studies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_customer_approval_templates_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customer_approval_templates_updated_at on public.customer_approval_templates;

create trigger customer_approval_templates_updated_at
  before update on public.customer_approval_templates
  for each row
  execute function public.set_customer_approval_templates_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.customer_approval_templates enable row level security;
alter table public.customer_approval_requests enable row level security;

drop policy if exists "admin_select_customer_approval_templates" on public.customer_approval_templates;
create policy "admin_select_customer_approval_templates"
  on public.customer_approval_templates for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_customer_approval_templates" on public.customer_approval_templates;
create policy "admin_insert_customer_approval_templates"
  on public.customer_approval_templates for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_customer_approval_templates" on public.customer_approval_templates;
create policy "admin_update_customer_approval_templates"
  on public.customer_approval_templates for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_customer_approval_templates" on public.customer_approval_templates;
create policy "admin_delete_customer_approval_templates"
  on public.customer_approval_templates for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_customer_approval_requests" on public.customer_approval_requests;
create policy "admin_select_customer_approval_requests"
  on public.customer_approval_requests for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_customer_approval_requests" on public.customer_approval_requests;
create policy "admin_insert_customer_approval_requests"
  on public.customer_approval_requests for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_customer_approval_requests" on public.customer_approval_requests;
create policy "admin_update_customer_approval_requests"
  on public.customer_approval_requests for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_customer_approval_requests" on public.customer_approval_requests;
create policy "admin_delete_customer_approval_requests"
  on public.customer_approval_requests for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Default templates
-- ---------------------------------------------------------------------------

insert into public.customer_approval_templates (template_type, template_name, subject, body, is_default)
select
  'testimonial_request',
  'Testimonial Request',
  'Request for Testimonial Approval – K&C Design and Manufacturing',
  E'Hi {customer_name},\n\nThank you for working with K&C Design and Manufacturing.\n\nWe are updating our website and marketing materials and would appreciate your permission to share a testimonial regarding your experience working with K&C.\n\nYou may provide a brief statement regarding quality, communication, responsiveness, machining support, tooling, fixtures, gauges, or overall service.\n\nNothing will be published without your review and approval.\n\nDisplay options may include:\n- Anonymous testimonial\n- First name only\n- Role/title only\n- Company name only\n- Name and company (if approved)\n\nThank you for your consideration.\n\nK&C Design and Manufacturing\n422 S. Irmen Drive\nAddison, IL 60101\n(630) 543-3386\ninfo@kcdesignmfg.com',
  true
where not exists (
  select 1 from public.customer_approval_templates where template_type = 'testimonial_request' and is_default = true
);

insert into public.customer_approval_templates (template_type, template_name, subject, body, is_default)
select
  'testimonial_approval',
  'Testimonial Final Approval',
  'Final Testimonial Approval Request',
  E'Hi {customer_name},\n\nAttached below is the testimonial text proposed for publication:\n\n"{testimonial_text}"\n\nDisplay format:\n{display_format}\n\nPlease reply confirming approval or requesting changes.\n\nNo content will be published until approval is received.\n\nThank you,\nK&C Design and Manufacturing',
  true
where not exists (
  select 1 from public.customer_approval_templates where template_type = 'testimonial_approval' and is_default = true
);

insert into public.customer_approval_templates (template_type, template_name, subject, body, is_default)
select
  'case_study_request',
  'Case Study Request',
  'Project Case Study Publication Request',
  E'Hi {customer_name},\n\nK&C Design and Manufacturing is preparing a project case study highlighting manufacturing solutions provided to customers.\n\nWe would like permission to create a case study based on the project described below:\n\nProject:\n{project_title}\n\nThe case study would focus on:\n- Manufacturing challenge\n- Solution provided\n- General results achieved\n\nNo pricing, confidential drawings, proprietary information, or protected project details will be disclosed.\n\nYou may choose:\n- Anonymous publication\n- Company-only identification\n- Named publication (if approved)\n\nNothing will be published without your approval.\n\nThank you,\nK&C Design and Manufacturing',
  true
where not exists (
  select 1 from public.customer_approval_templates where template_type = 'case_study_request' and is_default = true
);

insert into public.customer_approval_templates (template_type, template_name, subject, body, is_default)
select
  'case_study_approval',
  'Case Study Final Approval',
  'Final Case Study Approval Request',
  E'Hi {customer_name},\n\nThe draft case study is ready for your review.\n\nSummary:\n{case_study_summary}\n\nPublication format:\n{publication_mode}\n\nPlease review and confirm approval or provide requested revisions.\n\nNo publication will occur until approval is received.\n\nThank you,\nK&C Design and Manufacturing',
  true
where not exists (
  select 1 from public.customer_approval_templates where template_type = 'case_study_approval' and is_default = true
);

insert into public.customer_approval_templates (template_type, template_name, subject, body, is_default)
select
  'photo_approval',
  'Project Photo Approval',
  'Project Photo Publication Approval Request',
  E'Hi {customer_name},\n\nK&C Design and Manufacturing would like permission to use selected project photographs on our website and marketing materials.\n\nBefore publication we have reviewed the photos to ensure:\n- No confidential drawings are visible\n- No proprietary information is visible\n- No pricing information is visible\n- No protected customer information is visible\n\nPlease confirm approval or request changes.\n\nThank you,\nK&C Design and Manufacturing',
  true
where not exists (
  select 1 from public.customer_approval_templates where template_type = 'photo_approval' and is_default = true
);

insert into public.customer_approval_templates (template_type, template_name, subject, body, is_default)
select
  'final_publication_confirmation',
  'Final Publication Confirmation',
  'Publication Confirmation',
  E'Hi {customer_name},\n\nThank you for approving publication.\n\nThe approved content will be used according to the permissions you granted.\n\nApproved usage:\n{approved_usage}\n\nIf you later wish to update or remove the content, please contact K&C Design and Manufacturing.\n\nThank you for your support.',
  true
where not exists (
  select 1 from public.customer_approval_templates where template_type = 'final_publication_confirmation' and is_default = true
);
