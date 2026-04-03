import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import AdoptForm from './AdoptForm'

// Server component — fetches the animal before the page loads
// so the form and success screen have the animal's photo and name ready
async function getAnimal(id: string | null) {
  if (!id) return null
  const { data } = await supabase
    .from('animals')
    .select('id, name, sex, photo_urls, species, breed')
    .eq('id', id)
    .single()
  return data
}

export default async function AdoptApplyPage({
  searchParams,
}: {
  searchParams: { animal?: string }
}) {
  const animal = await getAnimal(searchParams.animal ?? null)

  return (
    <Suspense>
      <AdoptForm animal={animal} />
    </Suspense>
  )
}
