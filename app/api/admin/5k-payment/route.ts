import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_auth')?.value
  return token && token === process.env.ADMIN_SECRET
}

export async function PATCH(req: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, payment_received } = await req.json()

    if (!id || typeof payment_received !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const { error } = await getSupabaseServer()
      .from('event_registrations')
      .update({ payment_received })
      .eq('id', id)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Failed to update payment status.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
