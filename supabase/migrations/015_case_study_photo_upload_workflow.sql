-- K&C Design and Manufacturing — case study & photo upload workflow
-- Run after 019_post_launch_monitoring.sql

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  title text not null,
  slug text not null unique,
  status text not null default 'draft',
  source_type text not null default 'real',
  customer_display_mode text not null default 'anonymous',
  customer_name text,
  customer_company text,
  approved_customer_display_name text,
  approved_company_display_name text,
  industry text,
  capability text,
  material text,
  process text,
  challenge text,
  solution text,
  result text,
  public_summary text,
  internal_notes text,
  customer_approval_received boolean not null default false,
  customer_approval_date date,
  photo_approval_received boolean not null default false,
  photo_approval_date date,
  confidentiality_review_complete boolean not null default false,
  approved_for_public_use boolean not null default false,
  published_at timestamptz,
  constraint case_studies_status_check
    check (status in ('draft', 'pending_approval', 'approved', 'published', 'needs_revision', 'archived')),
  constraint case_studies_customer_display_mode_check
    check (customer_display_mode in ('anonymous', 'named_customer', 'named_company', 'named_customer_and_company')),
  constraint case_studies_source_type_check
    check (source_type in ('representative', 'real'))
);

create index if not exists case_studies_status_idx
  on public.case_studies (status, published_at desc nulls last);

create index if not exists case_studies_slug_idx
  on public.case_studies (slug);

create table if not exists public.case_study_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  case_study_id uuid not null references public.case_studies(id) on delete cascade,
  uploaded_by uuid references auth.users(id),
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint,
  alt_text text,
  caption text,
  category text,
  status text not null default 'draft',
  approved_for_public_use boolean not null default false,
  confidentiality_review_complete boolean not null default false,
  sort_order integer not null default 0,
  constraint case_study_photos_status_check
    check (status in ('draft', 'pending_review', 'approved', 'rejected', 'published', 'archived'))
);

create index if not exists case_study_photos_case_study_idx
  on public.case_study_photos (case_study_id, sort_order, created_at);

create table if not exists public.case_study_approval_checklists (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  case_study_id uuid not null references public.case_studies(id) on delete cascade,
  checklist_item text not null,
  category text not null,
  status text not null default 'pending',
  evidence text,
  completed_at timestamptz,
  completed_by uuid references auth.users(id),
  constraint case_study_approval_checklists_status_check
    check (status in ('pending', 'passed', 'failed', 'not_applicable'))
);

create index if not exists case_study_approval_checklists_case_study_idx
  on public.case_study_approval_checklists (case_study_id, category, created_at);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_case_studies_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists case_studies_updated_at on public.case_studies;

create trigger case_studies_updated_at
  before update on public.case_studies
  for each row
  execute function public.set_case_studies_updated_at();

-- ---------------------------------------------------------------------------
-- Storage bucket (private — signed URLs for approved published photos)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values ('case-study-photos', 'case-study-photos', false, 10485760)
on conflict (id) do update
set public = false,
    file_size_limit = 10485760;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.case_studies enable row level security;
alter table public.case_study_photos enable row level security;
alter table public.case_study_approval_checklists enable row level security;

-- case_studies: admin full access
drop policy if exists "admin_select_case_studies" on public.case_studies;
create policy "admin_select_case_studies"
  on public.case_studies for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_case_studies" on public.case_studies;
create policy "admin_insert_case_studies"
  on public.case_studies for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_case_studies" on public.case_studies;
create policy "admin_update_case_studies"
  on public.case_studies for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_case_studies" on public.case_studies;
create policy "admin_delete_case_studies"
  on public.case_studies for delete to authenticated
  using (public.is_admin());

-- case_studies: public read published only
drop policy if exists "public_select_published_case_studies" on public.case_studies;
create policy "public_select_published_case_studies"
  on public.case_studies for select to anon, authenticated
  using (
    status = 'published'
    and approved_for_public_use = true
    and confidentiality_review_complete = true
  );

-- case_study_photos: admin full access
drop policy if exists "admin_select_case_study_photos" on public.case_study_photos;
create policy "admin_select_case_study_photos"
  on public.case_study_photos for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_case_study_photos" on public.case_study_photos;
create policy "admin_insert_case_study_photos"
  on public.case_study_photos for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_case_study_photos" on public.case_study_photos;
create policy "admin_update_case_study_photos"
  on public.case_study_photos for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_case_study_photos" on public.case_study_photos;
create policy "admin_delete_case_study_photos"
  on public.case_study_photos for delete to authenticated
  using (public.is_admin());

-- case_study_photos: public read published approved photos on published case studies
drop policy if exists "public_select_published_case_study_photos" on public.case_study_photos;
create policy "public_select_published_case_study_photos"
  on public.case_study_photos for select to anon, authenticated
  using (
    status = 'published'
    and approved_for_public_use = true
    and confidentiality_review_complete = true
    and exists (
      select 1
      from public.case_studies cs
      where cs.id = case_study_photos.case_study_id
        and cs.status = 'published'
        and cs.approved_for_public_use = true
        and cs.confidentiality_review_complete = true
    )
  );

-- case_study_approval_checklists: admin only
drop policy if exists "admin_select_case_study_checklists" on public.case_study_approval_checklists;
create policy "admin_select_case_study_checklists"
  on public.case_study_approval_checklists for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_insert_case_study_checklists" on public.case_study_approval_checklists;
create policy "admin_insert_case_study_checklists"
  on public.case_study_approval_checklists for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin_update_case_study_checklists" on public.case_study_approval_checklists;
create policy "admin_update_case_study_checklists"
  on public.case_study_approval_checklists for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_delete_case_study_checklists" on public.case_study_approval_checklists;
create policy "admin_delete_case_study_checklists"
  on public.case_study_approval_checklists for delete to authenticated
  using (public.is_admin());

-- Storage: admin upload/manage
drop policy if exists "admin_insert_case_study_photo_storage" on storage.objects;
create policy "admin_insert_case_study_photo_storage"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'case-study-photos' and public.is_admin());

drop policy if exists "admin_select_case_study_photo_storage" on storage.objects;
create policy "admin_select_case_study_photo_storage"
  on storage.objects for select to authenticated
  using (bucket_id = 'case-study-photos' and public.is_admin());

drop policy if exists "admin_update_case_study_photo_storage" on storage.objects;
create policy "admin_update_case_study_photo_storage"
  on storage.objects for update to authenticated
  using (bucket_id = 'case-study-photos' and public.is_admin())
  with check (bucket_id = 'case-study-photos' and public.is_admin());

drop policy if exists "admin_delete_case_study_photo_storage" on storage.objects;
create policy "admin_delete_case_study_photo_storage"
  on storage.objects for delete to authenticated
  using (bucket_id = 'case-study-photos' and public.is_admin());

-- Storage: public read for published approved photos only
drop policy if exists "public_read_published_case_study_photo_storage" on storage.objects;
create policy "public_read_published_case_study_photo_storage"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'case-study-photos'
    and exists (
      select 1
      from public.case_study_photos p
      join public.case_studies cs on cs.id = p.case_study_id
      where p.file_path = storage.objects.name
        and p.status = 'published'
        and p.approved_for_public_use = true
        and p.confidentiality_review_complete = true
        and cs.status = 'published'
        and cs.approved_for_public_use = true
        and cs.confidentiality_review_complete = true
    )
  );
