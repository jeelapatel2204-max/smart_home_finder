create table public.seller_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  selling_path text not null check (selling_path in ('AGENT', 'FSBO')),
  property_address text not null check (char_length(property_address) between 5 and 300),
  timeline text not null check (char_length(timeline) between 1 and 80),
  notes text check (notes is null or char_length(notes) <= 2000),
  created_at timestamptz not null default now()
);

create index seller_inquiries_user_id_created_at_idx on public.seller_inquiries (user_id, created_at desc);

alter table public.seller_inquiries enable row level security;
revoke all on public.seller_inquiries from anon;
grant insert on public.seller_inquiries to authenticated;

create policy "Users submit their own seller inquiry" on public.seller_inquiries
  for insert to authenticated with check ((select auth.uid()) = user_id);
