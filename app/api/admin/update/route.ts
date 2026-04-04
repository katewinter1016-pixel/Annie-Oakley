import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { cookies } from 'next/headers'

function isAdmin() {
  const token = cookies().get('admin_auth')?.value
  return token && token === process.env.ADMIN_SECRET
}

export async function POST(req: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { table, id, data } = await req.json()

  const allowed = ['reviews', 'applications', 'animals']
  if (!allowed.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const { error } = await supabaseServer.from(table).update(data).eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
