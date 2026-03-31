-- ============================================================
-- Cope · Supabase Database Setup (Optimized & Secure)
-- Run this entire script in: Supabase → SQL Editor → New query
-- ============================================================

-- 1. Create the user_data table
create table if not exists public.user_data (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  user_name   text,
  check_ins   integer default 0,
  last_mood   jsonb default '{"moodScore":3, "anxietyScore":3}'::jsonb,
  vault       jsonb default '[]'::jsonb,
  all_data    jsonb default '{}'::jsonb,
  rituals     jsonb default '[]'::jsonb,
  updated_at  timestamptz default now()
);

-- 2. Create an index on user_id for faster lookups (though unique index exists)
create index if not exists idx_user_data_user_id on public.user_data(user_id);

-- 3. Function to automatically update the 'updated_at' timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 4. Trigger to call the function on any update to the table
drop trigger if exists set_updated_at on public.user_data;
create trigger set_updated_at
before update on public.user_data
for each row
execute function public.handle_updated_at();

-- 5. Enable Row Level Security (RLS)
alter table public.user_data enable row level security;

-- 6. SECURITY POLICIES (RLS)

-- POLICY: Users can only see their own row
drop policy if exists "Users can read own data" on public.user_data;
create policy "Users can read own data"
  on public.user_data
  for select
  to authenticated
  using (auth.uid() = user_id);

-- POLICY: Users can only insert their own row
drop policy if exists "Users can insert own data" on public.user_data;
create policy "Users can insert own data"
  on public.user_data
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- POLICY: Users can only update their own row
drop policy if exists "Users can update own data" on public.user_data;
create policy "Users can update own data"
  on public.user_data
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- POLICY: Users can only delete their own row
drop policy if exists "Users can delete own data" on public.user_data;
create policy "Users can delete own data"
  on public.user_data
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- 7. Revoke all permissions from public and grant only to authenticated roles
revoke all on public.user_data from public;
grant all on public.user_data to authenticated;
grant usage on schema public to authenticated;

-- Done! Your database is now secure and ready.
