-- ============================================================
-- Cope · Supabase Database Setup
-- Run this entire script in: Supabase → SQL Editor → New query
-- ============================================================

-- 1. Create the user_data table
create table if not exists public.user_data (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  user_name   text,
  check_ins   integer default 0,
  last_mood   jsonb,
  vault       jsonb default '[]'::jsonb,
  all_data    jsonb default '{}'::jsonb,
  rituals     jsonb default '[]'::jsonb,
  updated_at  timestamptz default now()
);

-- 2. Enable Row Level Security (so each user only sees their own data)
alter table public.user_data enable row level security;

-- 3. Policy: users can only read their own row
create policy "Users can read own data"
  on public.user_data
  for select
  using (auth.uid() = user_id);

-- 4. Policy: users can insert their own row
create policy "Users can insert own data"
  on public.user_data
  for insert
  with check (auth.uid() = user_id);

-- 5. Policy: users can update their own row
create policy "Users can update own data"
  on public.user_data
  for update
  using (auth.uid() = user_id);

-- 6. Policy: users can delete their own row
create policy "Users can delete own data"
  on public.user_data
  for delete
  using (auth.uid() = user_id);

-- Done! Your database is ready.
