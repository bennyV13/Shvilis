-- Create trip_profiles table with Row Level Security
create extension if not exists "uuid-ossp";

create table public.trip_profiles (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) not null,
  trip_name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.trip_profiles enable row level security;

create policy "User can access own trip profile"
  on public.trip_profiles for all
  using (auth.uid() = (select auth_uid from public.profiles where id = profile_id));
