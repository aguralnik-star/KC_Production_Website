-- Fix anonymous RFQ inserts blocked by reference-number trigger permissions

create or replace function public.rfq_requests_before_insert_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.submitted_at is null then
    new.submitted_at := now();
  end if;

  if new.reference_number is null or btrim(new.reference_number) = '' then
    new.reference_number := public.generate_rfq_reference_number();
  end if;

  return new;
end;
$$;

grant execute on function public.generate_rfq_reference_number() to anon, authenticated;
grant execute on function public.rfq_requests_before_insert_trigger() to anon, authenticated;

drop policy if exists "authenticated_insert_rfq_requests" on public.rfq_requests;
create policy "authenticated_insert_rfq_requests"
  on public.rfq_requests
  for insert
  to authenticated
  with check (true);
