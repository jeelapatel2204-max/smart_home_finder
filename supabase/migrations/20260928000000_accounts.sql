create table public.buyer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rules jsonb not null,
  updated_at timestamptz not null default now(),
  constraint buyer_profiles_rules_object check (jsonb_typeof(rules) = 'object')
);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create table public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  criteria jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_searches_criteria_object check (jsonb_typeof(criteria) = 'object')
);

create index favorites_user_id_created_at_idx on public.favorites (user_id, created_at desc);
create index saved_searches_user_id_updated_at_idx on public.saved_searches (user_id, updated_at desc);

alter table public.buyer_profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.saved_searches enable row level security;

revoke all on public.buyer_profiles, public.favorites, public.saved_searches from anon;
grant select, insert, update, delete on public.buyer_profiles, public.favorites, public.saved_searches to authenticated;

create policy "Users read their own buyer profile" on public.buyer_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create their own buyer profile" on public.buyer_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update their own buyer profile" on public.buyer_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete their own buyer profile" on public.buyer_profiles for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read their own favorites" on public.favorites for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create their own favorites" on public.favorites for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users delete their own favorites" on public.favorites for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read their own saved searches" on public.saved_searches for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create their own saved searches" on public.saved_searches for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update their own saved searches" on public.saved_searches for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete their own saved searches" on public.saved_searches for delete to authenticated using ((select auth.uid()) = user_id);
