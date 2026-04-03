import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import FosterForm from './FosterForm'

async function getAnimal(id: string | null) {
  if (!id) return null
  const { data } = await supabase
    .from('animals')
    .select('id, name, sex, photo_urls, species, breed')
    .eq('id', id)
    .single()
  return data
}

export default async function FosterApplyPage({
  searchParams,
}: {
  searchParams: { animal?: string }
}) {
  const animal = await getAnimal(searchParams.animal ?? null)

  return (
    <Suspense>
      <FosterForm animal={animal} />
    </Suspense>
  )
}
