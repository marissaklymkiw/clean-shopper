# Supabase Setup (dashboard SQL paste)

How to connect Clean Shopper to a Supabase project. ~5 minutes.

## 1. Create the project
1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Name it (e.g. `clean-shopper`), set a **database password** (save it somewhere), pick the closest region.
3. Wait ~2 minutes for it to provision.

## 2. Run the schema
1. In the project, open **SQL Editor** → **New query**.
2. Copy the entire contents of
   [`supabase/migrations/20260614000000_initial_schema.sql`](../supabase/migrations/20260614000000_initial_schema.sql)
   and paste it in.
3. Click **Run**. You should see "Success. No rows returned."
4. Open **Table Editor** to confirm the tables (`products`, `ingredients`, `cart_items`, …) exist.

## 3. Enable anonymous sign-ins (required)
The app uses anonymous auth (no accounts in V1). It's **off by default**.
1. Go to **Authentication → Sign In / Providers**.
2. Find **Anonymous sign-ins** and toggle it **on**. Save.

Without this, `ensureSession()` in [`src/lib/supabase.ts`](../src/lib/supabase.ts) will fail.

## 4. Add your keys
1. Go to **Settings → API**.
2. Copy **Project URL** and the **anon / public** key.
3. Paste them into [`.env.local`](../.env.local) (already created, git-ignored):
   ```
   VITE_SUPABASE_URL=https://your-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
   The anon key is safe in the browser — RLS is what protects the data.

## 5. Restart the dev server
Vite only reads env vars at startup:
```
npm run dev
```

## 6. Verify
Once env vars are set, we can call `ensureSession()` on app start and confirm a
session is created (visible under **Authentication → Users** as an anonymous user).

---

### Optional: seed the catalog
The catalog tables (`categories`, `certifications`) start empty. Ask Claude to
generate a seed file (top-level categories + subcategories, EWG/USDA/B-Corp
certifications) and run it the same way as the migration.
