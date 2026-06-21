-- Create meal_plans table with Row Level Security
create extension if not exists "uuid-ossp";

create table public.meal_plans (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) not null,
  plan_name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.meal_plans enable row level security;

create policy "User can access own meal plans"
  on public.meal_plans for all
  using (auth.uid() = (select auth_uid from public.profiles where id = profile_id));
