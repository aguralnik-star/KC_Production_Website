-- Public RFQ submission via SECURITY DEFINER RPC (bypasses anon RLS insert issue)

create or replace function public.submit_public_rfq(
  p_name text,
  p_company text default null,
  p_email text default null,
  p_phone text default null,
  p_project_type text default null,
  p_material text default null,
  p_quantity text default null,
  p_timeline text default null,
  p_notes text default null
)
returns table (
  id uuid,
  reference_number text,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.rfq_requests%rowtype;
begin
  if p_name is null or btrim(p_name) = '' then
    raise exception 'Name is required';
  end if;

  if p_email is null or btrim(p_email) = '' then
    raise exception 'Email is required';
  end if;

  insert into public.rfq_requests (
    name,
    company,
    email,
    phone,
    project_type,
    material,
    quantity,
    timeline,
    notes,
    status
  )
  values (
    btrim(p_name),
    nullif(btrim(coalesce(p_company, '')), ''),
    btrim(p_email),
    nullif(btrim(coalesce(p_phone, '')), ''),
    nullif(btrim(coalesce(p_project_type, '')), ''),
    nullif(btrim(coalesce(p_material, '')), ''),
    nullif(btrim(coalesce(p_quantity, '')), ''),
    nullif(btrim(coalesce(p_timeline, '')), ''),
    nullif(btrim(coalesce(p_notes, '')), ''),
    'new'
  )
  returning * into v_row;

  return query
  select v_row.id, v_row.reference_number, v_row.submitted_at;
end;
$$;

revoke all on function public.submit_public_rfq(text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_public_rfq(text, text, text, text, text, text, text, text, text) to anon, authenticated;

create or replace function public.submit_public_rfq_file(
  p_rfq_request_id uuid,
  p_file_name text,
  p_file_path text,
  p_file_type text default null,
  p_file_size bigint default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_rfq_request_id is null then
    raise exception 'RFQ request id is required';
  end if;

  if p_file_name is null or btrim(p_file_name) = '' then
    raise exception 'File name is required';
  end if;

  if p_file_path is null or btrim(p_file_path) = '' then
    raise exception 'File path is required';
  end if;

  insert into public.rfq_files (
    rfq_request_id,
    file_name,
    file_path,
    file_type,
    file_size
  )
  values (
    p_rfq_request_id,
    btrim(p_file_name),
    btrim(p_file_path),
    nullif(btrim(coalesce(p_file_type, '')), ''),
    p_file_size
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_public_rfq_file(uuid, text, text, text, bigint) from public;
grant execute on function public.submit_public_rfq_file(uuid, text, text, text, bigint) to anon, authenticated;
