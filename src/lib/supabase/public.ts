import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Read-only, cookie-free Supabase client for pages/components that only ever
// read publicly-readable tables (RLS "public read" policies) and never touch
// the visitor's session.
//
// Why this exists: Next.js opts a whole route out of static rendering / ISR
// the moment ANY component it renders calls `cookies()` — and the session-bound
// client in `./server.ts` always calls `cookies()` internally, even for a query
// that never actually needs the visitor's identity. Since this client never
// touches cookies, pages built only from this client (plus one with
// `export const revalidate = ...`) can be cached and served instantly instead
// of re-querying Supabase on every single navigation.
//
// Same async signature as `./server.ts`'s createClient() so call sites
// (`const supabase = await createClient();`) don't need to change — only the
// import path does.
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
