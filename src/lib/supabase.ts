import "server-only"
import { createClient } from "@supabase/supabase-js"
import { SUPABASE_SCHEMA } from "./constants"

// Factory, not singleton. Benchmark 2026-05-11: createClient() ~0.26ms/call,
// max ~2ms saved per request via singleton — below YAGNI threshold.
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, {
    db: { schema: SUPABASE_SCHEMA },
    auth: { persistSession: false },
  })
}

// TODO: Use createServiceClient() only in Server Actions or Route Handlers that
// need to bypass RLS (e.g. admin writes, L2/L3 smoke cross-checks).
// NEVER import this in Client Components — "server-only" enforces that at build time.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    db: { schema: SUPABASE_SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
