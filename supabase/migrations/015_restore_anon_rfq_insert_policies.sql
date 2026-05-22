-- Ensure anonymous RFQ submission policies exist (production validation fix)
-- Some environments were missing anon insert policies after manual schema changes.

drop policy if exists "anon_insert_rfq_requests" on public.rfq_requests;
create policy "anon_insert_rfq_requests"
  on public.rfq_requests
  for insert
  to anon
  with check (true);

drop policy if exists "anon_insert_rfq_files" on public.rfq_files;
create policy "anon_insert_rfq_files"
  on public.rfq_files
  for insert
  to anon
  with check (true);

drop policy if exists "anon_upload_rfq_files" on storage.objects;
create policy "anon_upload_rfq_files"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'rfq-files'
    and (storage.foldername(name))[1] = 'rfq'
  );
