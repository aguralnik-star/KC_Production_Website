-- K&C Design and Manufacturing — customer reference permission tracking
-- Run after 017_customer_approval_request_templates.sql

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.customer_references (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  customer_name text,
  customer_company text,
  customer_email text,
  customer_phone text,
  customer_role text,
  industry text,
  relationship_type text not null default 'customer',
  reference_status text not null default 'prospect',
  public_display_mode text not null default 'anonymous',
  approved_display_name text,
  approved_company_display text,
  approved_role_display text,
  internal_notes text,
  do_not_contact boolean not null default false,
  constraint customer_references_relationship_type_check
    check (relationship_type in ('customer', 'prospect', 'vendor', 'partner', 'other')),
  constraint customer_references_reference_status_check
    check (reference_status in ('prospect', 'requested', 'approved', 'declined', 'active_reference', 'archived')),
  constraint customer_references_public_display_mode_check
    check (public_display_mode in (
      'anonymous',
      'name_only',
      'company_only',
      'role_only',
      'name_and_company',
      'name_company_and_role'
    ))
);

create index if not exists customer_references_status_idx
  on public.customer_references (reference_status, updated_at desc);

create index if not exists customer_references_company_idx
  on public.customer_references (customer_company, customer_name);

create table if not exists public.customer_reference_permissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_reference_id uuid not null references public.customer_references(id) on delete cascade,
  permission_type text not null,
  permission_status text not null default 'not_requested',
  allowed_usage text[] not null default '{}',
  approval_method text,
  approval_date date,
  expiration_date date,
  approval_evidence text,
  restrictions text,
  approved_by_customer_name text,
  reviewed_by uuid references auth.users(id),
  internal_notes text,
  constraint customer_reference_permissions_type_check
    check (permission_type in (
      'testimonial',
      'case_study',
      'project_photos',
      'company_name',
      'customer_name',
      'customer_role',
      'logo',
      'anonymous_reference',
      'sales_materials',
      'website_publication',
      'social_media'
    )),
  constraint customer_reference_permissions_status_check
    check (permission_status in (
      'not_requested',
      'requested',
      'approved',
      'declined',
      'expired',
      'revoked'
    )),
  constraint customer_reference_permissions_approval_method_check
    check (approval_method is null or approval_method in ('email', 'signed_form', 'verbal', 'contract', 'other')),
  constraint customer_reference_permissions_unique_type
    unique (customer_reference_id, permission_type)
);

create index if not exists customer_reference_permissions_ref_idx
  on public.customer_reference_permissions (customer_reference_id, permission_type);

create table if not exists public.customer_reference_activity (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_reference_id uuid not null references public.customer_references(id) on delete cascade,
  activity_type text not null,
  activity_summary text not null,
  created_by uuid references auth.users(id),
  related_table text,
  related_record_id uuid,
  notes text,
  constraint customer_reference_activity_type_check
    check (activity_type in (
      'reference_created',
      'permission_requested',
      'permission_approved',
      'permission_declined',
      'permission_revoked',
      'testimonial_linked',
      'case_study_linked',
      'photo_linked',
      'publication_approved',
      'content_published',
      'contact_updated',
      'do_not_contact_set',
      'note_added'
    ))
);

create index if not exists customer_reference_activity_ref_idx
  on public.customer_reference_activity (customer_reference_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Link existing content tables
-- ---------------------------------------------------------------------------

alter table public.testimonials
  add column if not exists customer_reference_id uuid references public.customer_references(id) on delete set null;

alter table public.case_studies
  add column if not exists customer_reference_id uuid references public.customer_references(id) on delete set null;

alter table public.case_study_photos
  add column if not exists customer_reference_id uuid references public.customer_references(id) on delete set null;

alter table public.customer_approval_requests
  add column if not exists customer_reference_id uuid references public.customer_references(id) on delete set null;

create index if not exists testimonials_customer_reference_idx
  on public.testimonials (customer_reference_id);

create index if not exists case_studies_customer_reference_idx
  on public.case_studies (customer_reference_id);

create index if not exists case_study_photos_customer_reference_idx
  on public.case_study_photos (customer_reference_id);

create index if not exists customer_approval_requests_reference_idx
  on public.customer_approval_requests (customer_reference_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_customer_references_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_customer_reference_permissions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customer_references_updated_at on public.customer_references;
create trigger customer_references_updated_at
  before update on public.customer_references
  for each row
  execute function public.set_customer_references_updated_at();

drop trigger if exists customer_reference_permissions_updated_at on public.customer_reference_permissions;
create trigger customer_reference_permissions_updated_at
  before update on public.customer_reference_permissions
  for each row
  execute function public.set_customer_reference_permissions_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — admin only, no public access
-- ---------------------------------------------------------------------------

alter table public.customer_references enable row level security;
alter table public.customer_reference_permissions enable row level security;
alter table public.customer_reference_activity enable row level security;

drop policy if exists "admin_select_customer_references" on public.customer_references;
create policy "admin_select_customer_references"
  on public.customer_references for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_customer_references" on public.customer_references;
create policy "admin_insert_customer_references"
  on public.customer_references for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_customer_references" on public.customer_references;
create policy "admin_update_customer_references"
  on public.customer_references for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_customer_references" on public.customer_references;
create policy "admin_delete_customer_references"
  on public.customer_references for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_customer_reference_permissions" on public.customer_reference_permissions;
create policy "admin_select_customer_reference_permissions"
  on public.customer_reference_permissions for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_customer_reference_permissions" on public.customer_reference_permissions;
create policy "admin_insert_customer_reference_permissions"
  on public.customer_reference_permissions for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_customer_reference_permissions" on public.customer_reference_permissions;
create policy "admin_update_customer_reference_permissions"
  on public.customer_reference_permissions for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_customer_reference_permissions" on public.customer_reference_permissions;
create policy "admin_delete_customer_reference_permissions"
  on public.customer_reference_permissions for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_customer_reference_activity" on public.customer_reference_activity;
create policy "admin_select_customer_reference_activity"
  on public.customer_reference_activity for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_customer_reference_activity" on public.customer_reference_activity;
create policy "admin_insert_customer_reference_activity"
  on public.customer_reference_activity for insert to authenticated
  with check (public.is_admin());
