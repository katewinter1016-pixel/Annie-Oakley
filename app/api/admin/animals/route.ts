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

  const body = await req.json()
  const { name, species, breed, sex, age_years, description, status, photo_urls } = body

  const { data, error } = await supabaseServer.from('animals').insert({
    name,
    species,
    breed: breed || null,
    sex: sex || null,
    age_years: age_years ? Number(age_years) : null,
    description: description || null,
    status,
    photo_urls: photo_urls?.length > 0 ? photo_urls : null,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, ...fields } = body

  const { error } = await supabaseServer.from('animals').update({
    name: fields.name,
    species: fields.species,
    breed: fields.breed || null,
    sex: fields.sex || null,
    age_years: fields.age_years ? Number(fields.age_years) : null,
    description: fields.description || null,
    status: fields.status,
    photo_urls: fields.photo_urls?.length > 0 ? fields.photo_urls : null,
  }).eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
