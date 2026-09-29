alter table public.seller_inquiries
  add column status text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'CLOSED'));

create index seller_inquiries_status_created_at_idx on public.seller_inquiries (status, created_at desc);

grant select on public.seller_inquiries to authenticated;

create policy "Users read their own seller inquiries" on public.seller_inquiries
  for select to authenticated using ((select auth.uid()) = user_id);
