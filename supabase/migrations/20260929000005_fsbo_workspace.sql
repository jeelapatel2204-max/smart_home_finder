create table public.seller_fsbo_plans (
  seller_inquiry_id uuid primary key references public.seller_inquiries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_price numeric(12,2) check (target_price is null or target_price > 0),
  low_price numeric(12,2) check (low_price is null or low_price > 0),
  high_price numeric(12,2) check (high_price is null or high_price > 0),
  pricing_notes text check (pricing_notes is null or char_length(pricing_notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (low_price is null or high_price is null or low_price <= high_price)
);

create table public.seller_fsbo_showings (
  id uuid primary key default gen_random_uuid(),
  seller_inquiry_id uuid not null references public.seller_inquiries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null,
  visitor_name text not null check (char_length(visitor_name) between 1 and 160),
  notes text check (notes is null or char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);

create table public.seller_fsbo_offers (
  id uuid primary key default gen_random_uuid(),
  seller_inquiry_id uuid not null references public.seller_inquiries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  buyer_name text not null check (char_length(buyer_name) between 1 and 160),
  offer_price numeric(12,2) not null check (offer_price > 0),
  financing text not null check (char_length(financing) between 1 and 120),
  closing_date date,
  status text not null default 'RECEIVED' check (status in ('RECEIVED', 'COUNTERED', 'ACCEPTED', 'DECLINED')),
  notes text check (notes is null or char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);

create index seller_fsbo_showings_inquiry_starts_at_idx on public.seller_fsbo_showings (seller_inquiry_id, starts_at);
create index seller_fsbo_offers_inquiry_created_at_idx on public.seller_fsbo_offers (seller_inquiry_id, created_at desc);

alter table public.seller_fsbo_plans enable row level security;
alter table public.seller_fsbo_showings enable row level security;
alter table public.seller_fsbo_offers enable row level security;

revoke all on public.seller_fsbo_plans, public.seller_fsbo_showings, public.seller_fsbo_offers from anon;
grant select, insert, update on public.seller_fsbo_plans, public.seller_fsbo_showings, public.seller_fsbo_offers to authenticated;

create policy "Users manage their own FSBO plan" on public.seller_fsbo_plans
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their own FSBO showings" on public.seller_fsbo_showings
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their own FSBO offers" on public.seller_fsbo_offers
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
