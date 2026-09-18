import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free server client for public, cacheable reads (catalog data).
 *
 * Unlike `lib/supabase/server.ts`, this client never calls `cookies()`,
 * so pages that only fetch public data can be statically prerendered
 * (no DYNAMIC_SERVER_USAGE bail-out). Access is scoped by RLS to
 * active categories/products — the same data anonymous visitors see.
 *
 * Do NOT use this for anything auth-scoped (admin reads, user session):
 * use `createClient` from `@/lib/supabase/server` instead.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
