create table public.seller_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.seller_fsbo_tasks (
  id uuid primary key default gen_random_uuid(),
  seller_inquiry_id uuid not null references public.seller_inquiries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (seller_inquiry_id, title)
);

create index seller_fsbo_tasks_inquiry_idx on public.seller_fsbo_tasks (seller_inquiry_id, created_at);

alter table public.seller_admins enable row level security;
alter table public.seller_fsbo_tasks enable row level security;

revoke all on public.seller_admins, public.seller_fsbo_tasks from anon;
grant select on public.seller_admins to authenticated;
grant select, insert, update on public.seller_fsbo_tasks to authenticated;
grant update on public.seller_inquiries to authenticated;

create policy "Admins identify themselves" on public.seller_admins
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users read their own FSBO tasks" on public.seller_fsbo_tasks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create their own FSBO tasks" on public.seller_fsbo_tasks
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update their own FSBO tasks" on public.seller_fsbo_tasks
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Seller admins read all seller inquiries" on public.seller_inquiries
  for select to authenticated using (
    exists (select 1 from public.seller_admins where seller_admins.user_id = (select auth.uid()))
  );
create policy "Seller admins update seller inquiries" on public.seller_inquiries
  for update to authenticated using (
    exists (select 1 from public.seller_admins where seller_admins.user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.seller_admins where seller_admins.user_id = (select auth.uid()))
  );
