-- K&C Design and Manufacturing — Admin profiles and role-based RFQ policies
-- Run via Supabase CLI or SQL Editor after 001_create_rfq_requests.sql
--
-- ---------------------------------------------------------------------------
-- SEED INSTRUCTIONS — Create the first admin
-- ---------------------------------------------------------------------------
-- 1. Create a user manually in Supabase Auth (Dashboard → Authentication → Users).
-- 2. Copy the user's UUID from the Auth users table.
-- 3. Run:
--
--    insert into public.admin_profiles (id, email, role, is_active)
--    values ('USER_ID_HERE', 'admin@example.com', 'owner', true);
--
-- Do not create public signup. Only manually created Auth users can become admins.
-- ---------------------------------------------------------------------------

-- Remove temporary authenticated-only policies from prior migration (if present)
drop policy if exists "authenticated_select_rfq_requests" on public.rfq_requests;
drop policy if exists "authenticated_update_rfq_requests" on public.rfq_requests;
drop policy if exists "authenticated_select_rfq_files" on public.rfq_files;
drop policy if exists "authenticated_read_rfq_storage" on storage.objects;

-- ---------------------------------------------------------------------------
-- Admin profiles
-- ---------------------------------------------------------------------------

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  email text not null unique,
  role text not null default 'admin',
  is_active boolean not null default true,
  constraint admin_profiles_role_check check (role in ('admin', 'owner'))
);

alter table public.admin_profiles enable row level security;

-- ---------------------------------------------------------------------------
-- Helper: is_admin()
-- Returns true when the current auth user is an active admin or owner.
-- SECURITY DEFINER allows the check without RLS recursion issues.
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_active = true
      and role in ('admin', 'owner')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to anon;

-- ---------------------------------------------------------------------------
-- admin_profiles RLS
-- ---------------------------------------------------------------------------

-- Users can read their own profile (login/access checks); admins can read all profiles
create policy "admin_profiles_select"
  on public.admin_profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- No insert/update/delete for authenticated users from the frontend.
-- Service role manages admin_profiles directly.

-- ---------------------------------------------------------------------------
-- rfq_requests RLS (admin read/update; anonymous insert unchanged from 001)
-- ---------------------------------------------------------------------------

create policy "admin_select_rfq_requests"
  on public.rfq_requests
  for select
  to authenticated
  using (public.is_admin());

create policy "admin_update_rfq_requests"
  on public.rfq_requests
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No delete policy for authenticated users.

-- ---------------------------------------------------------------------------
-- rfq_files RLS (admin read; anonymous insert unchanged from 001)
-- ---------------------------------------------------------------------------

create policy "admin_select_rfq_files"
  on public.rfq_files
  for select
  to authenticated
  using (public.is_admin());

-- No delete policy for authenticated users.

-- ---------------------------------------------------------------------------
-- Storage: rfq-files bucket (admin read; anonymous upload unchanged from 001)
-- ---------------------------------------------------------------------------

create policy "admin_read_rfq_storage"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'rfq-files' and public.is_admin());

-- Anonymous upload policy "anon_upload_rfq_files" remains from migration 001.
-- Public read stays disabled. Service role bypasses RLS for full management.
