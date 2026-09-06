import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Deliberately the SERVICE ROLE key, never the anon key: every query in this
 * app runs inside a route handler or a server component, and the schema turns
 * RLS on without a single policy. Nothing in the browser can reach the
 * database directly, so there is no key to leak and no policy to get wrong.
 *
 * Keep this module out of client components — importing it there would inline
 * the key into the bundle.
 */
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!url || !key) {
    throw new Error(
      "Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY. Xem .env.example.",
    );
  }
  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
