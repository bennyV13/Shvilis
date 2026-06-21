-- Create custom_foods table with Row Level Security
create extension if not exists "uuid-ossp";

create table public.custom_foods (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) not null,
  name text not null,
  calories integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.custom_foods enable row level security;

create policy "User can access own custom foods"
  on public.custom_foods for all
  using (auth.uid() = (select auth_uid from public.profiles where id = profile_id));
