create table public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('idea', 'issue', 'question')),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

create index feedback_submissions_created_at_idx on public.feedback_submissions (created_at desc);

alter table public.feedback_submissions enable row level security;
revoke all on public.feedback_submissions from anon;
grant insert on public.feedback_submissions to authenticated;

create policy "Users submit their own feedback" on public.feedback_submissions
  for insert to authenticated with check ((select auth.uid()) = user_id);
