# Supabase setup

1. Create a Supabase project at [database.new](https://database.new).
2. In the project SQL Editor, run [the accounts migration](../supabase/migrations/20260928000000_accounts.sql).
3. In **Authentication → URL Configuration**, add your local URL (`http://localhost:3000`) and your production URL when deployed.
4. Copy the project URL and the **publishable key** from **Connect** or **API Keys** into a local `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never use the `service_role` key in this application or send it to anyone. The browser uses only the publishable key; the database migration enforces user ownership with row-level security.

The sign-in flow uses Supabase email magic links. Configure an email provider in Supabase before inviting real users to the product.
