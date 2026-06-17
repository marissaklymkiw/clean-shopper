import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example to .env.local and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

/**
 * Ensure the visitor has a session. Clean Shopper has no accounts in V1, so we
 * sign in anonymously — this creates a stable per-device user_id that cart and
 * preferences hang off of (and that RLS scopes every query to). Idempotent:
 * returns the existing session if one is already persisted.
 */
export async function ensureSession() {
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session

  const { data: signedIn, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return signedIn.session
}
