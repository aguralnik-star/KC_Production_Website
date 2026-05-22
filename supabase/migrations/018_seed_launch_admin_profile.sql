-- K&C Design and Manufacturing — seed launch admin profile
-- Run after 017_submit_public_rfq_rpc.sql
--
-- Grants owner admin access to the Auth user with email aguralnik@gmail.com.
-- Idempotent: safe to re-run if the profile already exists.

insert into public.admin_profiles (id, email, role, is_active)
select id, email, 'owner', true
from auth.users
where lower(email) = lower('aguralnik@gmail.com')
on conflict (id) do update
set
  email = excluded.email,
  role = excluded.role,
  is_active = excluded.is_active;
