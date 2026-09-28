# Test deployment

Use Vercel to publish a test version of this Next.js app.

1. Push the project to GitHub without `.env.local`.
2. In Vercel, choose **Add New → Project**, import the GitHub repository, and keep the detected Next.js settings.
3. In **Settings → Environment Variables**, add the values from `.env.example` that you are using:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `RENTCAST_API_KEY` only if live RentCast listings are enabled
   - `GOOGLE_MAPS_API_KEY` only if Google nearby places are enabled
4. Deploy. Vercel provides a test URL automatically.
5. In Supabase Auth settings, add the Vercel URL to the allowed redirect URLs so magic-link sign-in works.
6. Deploy the `delete-account` Edge Function before testing permanent account deletion.

## Before sharing the test URL

- Apply `supabase/migrations/20260928000001_feedback.sql` in the Supabase SQL Editor so signed-in feedback works.
- Create a test account, save a home, save a search, edit the profile, and submit feedback.
- Verify the Privacy and Terms pages load.
- Test the site on a phone and a desktop browser.

Never paste real keys into source files, GitHub, or feedback messages. `.env.local` stays local and is ignored by Git.
