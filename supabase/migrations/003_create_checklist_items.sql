-- Create checklist_items table with Row Level Security
create extension if not exists "uuid-ossp";

create table public.checklist_items (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) not null,
  item_name text not null,
  completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.checklist_items enable row level security;

create policy "User can access own checklist items"
  on public.checklist_items for all
  using (auth.uid() = (select auth_uid from public.profiles where id = profile_id));
