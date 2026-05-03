import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Server-only client — uses service role key to bypass RLS.
// Never import this in client components.
// Instantiated lazily so Next.js build-time analysis doesn't crash
// when env vars are unavailable outside of a request context.

let _client: SupabaseClient | null = null

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop: string) {
    if (!_client) {
      _client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    }
    const value = (_client as unknown as Record<string, unknown>)[prop]
    return typeof value === 'function' ? value.bind(_client) : value
  },
})
