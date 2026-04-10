import { NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabaseServer'

const TOTAL_SLOTS = 15

export async function GET() {
  const { count } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact', head: true })
    .ilike('interests', '%Work at the 5K%')

  const taken = count ?? 0
  const remaining = Math.max(0, TOTAL_SLOTS - taken)

  return NextResponse.json({ taken, remaining, full: remaining === 0 })
}
