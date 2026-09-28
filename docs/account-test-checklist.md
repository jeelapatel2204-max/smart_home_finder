# Account testing checklist

## One-time setup for permanent account deletion

Deploy the protected Supabase Edge Function from the project root:

```bash
supabase functions deploy delete-account
```

The function uses Supabase's server-side environment variables. Do not put a service-role key in `.env.local` or browser code.

## Manual test checklist

1. Create an account with the Login / Sign in form.
2. Open the secure email link.
3. Save a favorite, filter rules, and a saved search.
4. Refresh the page or sign in from another browser to confirm the data returns.
5. In **Account**, edit the name and optional phone number, then reopen the account window to confirm the changes.
6. Change the email address and complete the confirmation links sent by Supabase.
7. Use **Delete saved data** and confirm the account itself remains signed in.
8. In a test account only, use **Delete my account**, then confirm the account can no longer sign in.
