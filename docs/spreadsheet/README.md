# Account and seller spreadsheet templates

- [account.csv](./account.csv) is the approved column layout for an account export.
- [sell.csv](./sell.csv) is the approved column layout for a seller-request export.

These files are templates only. They must never contain real customer names, emails, phone numbers, addresses, or other personal data in Git. Live account information remains in Supabase Auth, and seller requests remain in the private `seller_inquiries` table.

When an authorized business owner needs a spreadsheet, export the requested data from Supabase to a private, access-controlled workspace using these columns. Account contact details are available through Supabase Auth; seller requests are in `seller_inquiries`. Never export this data into the repository or a public document.
