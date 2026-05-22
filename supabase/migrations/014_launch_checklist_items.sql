-- K&C Design and Manufacturing — launch checklist persistence
-- Run after 013_rfq_production_monitoring_command_center.sql

create table if not exists public.launch_checklist_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  category text not null,
  item text not null,
  status text not null default 'pending',
  evidence text,
  completed_by uuid references auth.users(id),
  completed_at timestamptz,
  constraint launch_checklist_items_status_check
    check (status in ('pending', 'completed', 'not_applicable'))
);

create unique index if not exists launch_checklist_items_category_item_idx
  on public.launch_checklist_items (category, item);

create or replace function public.set_launch_checklist_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists launch_checklist_items_updated_at on public.launch_checklist_items;

create trigger launch_checklist_items_updated_at
  before update on public.launch_checklist_items
  for each row
  execute function public.set_launch_checklist_items_updated_at();

alter table public.launch_checklist_items enable row level security;

create policy "admin_select_launch_checklist_items"
  on public.launch_checklist_items for select to authenticated
  using (public.is_admin());

create policy "admin_insert_launch_checklist_items"
  on public.launch_checklist_items for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_launch_checklist_items"
  on public.launch_checklist_items for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_delete_launch_checklist_items"
  on public.launch_checklist_items for delete to authenticated
  using (public.is_admin());
