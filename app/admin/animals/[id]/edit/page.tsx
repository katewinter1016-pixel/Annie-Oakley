import { supabaseServer } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import EditAnimalForm from './EditAnimalForm'

export const dynamic = 'force-dynamic'

export default async function EditAnimalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: animal } = await supabaseServer
    .from('animals')
    .select('*')
    .eq('id', id)
    .single()

  if (!animal) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Edit {animal.name}</h1>
        <p className="text-stone-400 mt-1">Update this animal's information.</p>
      </div>
      <EditAnimalForm animal={animal} />
    </div>
  )
}
