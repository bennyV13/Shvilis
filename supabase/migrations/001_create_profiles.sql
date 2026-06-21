-- Create profiles table with Row Level Security
create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_uid uuid not null,
  username text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "User can access own profile"
  on public.profiles for all
  using (auth_uid = auth.uid());
