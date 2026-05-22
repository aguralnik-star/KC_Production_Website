-- Admin dashboard access for authenticated Supabase users
-- Temporary guard: any authenticated user can review RFQs.
-- TODO: Replace with role-based policies when admin_users table is added.

-- RFQ requests: authenticated read + update (status changes)
create policy "authenticated_select_rfq_requests"
  on public.rfq_requests
  for select
  to authenticated
  using (true);

create policy "authenticated_update_rfq_requests"
  on public.rfq_requests
  for update
  to authenticated
  using (true)
  with check (true);

-- RFQ files: authenticated read
create policy "authenticated_select_rfq_files"
  on public.rfq_files
  for select
  to authenticated
  using (true);

-- Storage: authenticated users can read RFQ uploads (signed URLs / downloads)
create policy "authenticated_read_rfq_storage"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'rfq-files');
