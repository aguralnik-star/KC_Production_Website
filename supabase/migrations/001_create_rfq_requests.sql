-- K&C Design and Manufacturing — RFQ backend schema
-- Run via Supabase CLI: supabase db push
-- Or paste into Supabase Dashboard → SQL Editor

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.rfq_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text not null,
  phone text,
  project_type text,
  material text,
  quantity text,
  timeline text,
  notes text,
  status text not null default 'new'
);

create table if not exists public.rfq_files (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint
);

create index if not exists rfq_files_request_id_idx on public.rfq_files (rfq_request_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.rfq_requests enable row level security;
alter table public.rfq_files enable row level security;

-- Anonymous visitors may submit RFQ requests (website form)
create policy "anon_insert_rfq_requests"
  on public.rfq_requests
  for insert
  to anon
  with check (true);

-- Anonymous visitors may attach file metadata after upload
create policy "anon_insert_rfq_files"
  on public.rfq_files
  for insert
  to anon
  with check (true);

-- No anonymous select/update/delete policies — public cannot read or modify records.
-- Supabase service role (Edge Functions, admin) bypasses RLS for full access.

-- ---------------------------------------------------------------------------
-- Storage bucket: rfq-files (private)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values ('rfq-files', 'rfq-files', false, 20971520)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

-- Allow anonymous uploads only into rfq-files bucket under rfq/ prefix
create policy "anon_upload_rfq_files"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'rfq-files'
    and (storage.foldername(name))[1] = 'rfq'
  );

-- No anonymous read/update/delete policies on storage.objects.
-- Service role can read/manage all files for internal review and email notifications.
