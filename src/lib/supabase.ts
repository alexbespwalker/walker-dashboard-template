import { createClient } from "@supabase/supabase-js"
import { SUPABASE_SCHEMA } from "./constants"

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, { db: { schema: SUPABASE_SCHEMA } })
}
