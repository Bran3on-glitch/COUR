# cour
A home for anime lovers: log anime, review them, follow friends, like reviews. Next.js + Supabase, anime data from AniList.

## Set up
1. Create a free project at supabase.com. Open SQL Editor, paste `supabase/schema.sql`, run it.
2. Supabase > Authentication > Providers > Email: for testing, turn off "Confirm email".
3. Supabase > Project Settings > API: copy the Project URL and anon public key.
4. Locally: `cp .env.example .env.local`, paste the two values, then `npm install` and `npm run dev` (http://localhost:3000).

## Launch on Vercel
1. Push this folder to a new GitHub repo.
2. vercel.com > Add New > Project > import the repo.
3. Before deploying, add Environment Variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Deploy.
4. Supabase > Authentication > URL Configuration: set Site URL to your Vercel URL.
5. Vercel > Settings > Domains: add your domain (for example cour.app) and follow the DNS steps.

## Next
MAL/AniList import, custom lists, watchlist, comments, report button, privacy policy and terms pages.
