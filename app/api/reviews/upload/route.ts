import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size must be under 10MB' }, { status: 400 })
  }

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const { data: uploadData, error } = await supabaseServer.storage
    .from('Review Photos')
    .upload(filename, file, { upsert: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabaseServer.storage
    .from('Review Photos')
    .getPublicUrl(uploadData.path)

  return NextResponse.json({ url: urlData.publicUrl })
}
