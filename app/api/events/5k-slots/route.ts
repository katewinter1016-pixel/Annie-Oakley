import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'

const LIMITS: Record<string, number> = { booth: 6, walk: 4, alternate: 5 }

export async function GET() {
  const { data } = await getSupabaseServer()
    .from('event_registrations')
    .select('volunteer_role')
    .eq('event_id', '5k-2026')
    .not('volunteer_role', 'is', null)

  const counts: Record<string, number> = { booth: 0, walk: 0, alternate: 0 }
  for (const row of data ?? []) {
    const role = row.volunteer_role as string
    if (role in counts) counts[role]++
  }

  const result = Object.fromEntries(
    Object.entries(LIMITS).map(([role, max]) => [
      role,
      { taken: counts[role], remaining: Math.max(0, max - counts[role]), max },
    ])
  )

  return NextResponse.json(result)
}
