import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_auth')?.value
  return token && token === process.env.ADMIN_SECRET
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string

  if (!file || !bucket) {
    return NextResponse.json({ error: 'Missing file or bucket' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size must be under 10MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabaseServer.storage.from(bucket).upload(path, file, { upsert: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabaseServer.storage.from(bucket).getPublicUrl(path)

  return NextResponse.json({ url: urlData.publicUrl })
}
