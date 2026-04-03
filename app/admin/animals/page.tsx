import { supabaseServer as supabase } from '@/lib/supabaseServer'
import Image from 'next/image'
import Link from 'next/link'
import AnimalRowActions from './AnimalRowActions'

async function getAnimals() {
  const { data } = await supabase
    .from('animals')
    .select('id, name, species, breed, age_years, sex, status, photo_urls, created_at')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminAnimalsPage() {
  const animals = await getAnimals()

  const available = animals.filter((a) => a.status === 'available')
  const other = animals.filter((a) => a.status !== 'available')

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Animals</h1>
          <p className="text-stone-400 mt-1">Manage rescue animals and their listings.</p>
        </div>
        <Link
          href="/admin/animals/new"
          className="bg-[#D4A017] text-[#2D1606] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors"
        >
          + Add New Animal
        </Link>
      </div>

      {/* Available */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-display text-xl font-bold text-stone-700">Available</h2>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {available.length}
          </span>
        </div>

        {available.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
            <p className="text-stone-400">No available animals listed.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {available.map((animal) => (
              <AnimalRow key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </section>

      {/* Other statuses */}
      {other.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-stone-700 mb-5">
            Other ({other.length})
          </h2>
          <div className="flex flex-col gap-3">
            {other.map((animal) => (
              <AnimalRow key={animal.id} animal={animal} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function AnimalRow({ animal }: { animal: Record<string, unknown> }) {
  const id = animal.id as string
  const name = animal.name as string
  const species = animal.species as string
  const breed = animal.breed as string | null
  const ageYears = animal.age_years as number | null
  const sex = animal.sex as string | null
  const status = animal.status as string
  const photoUrls = animal.photo_urls as string[] | null
  const createdAt = animal.created_at as string

  const statusStyles: Record<string, string> = {
    available: 'bg-green-50 text-green-700 border border-green-200',
    adopted: 'bg-blue-50 text-blue-600 border border-blue-200',
    fostered: 'bg-purple-50 text-purple-600 border border-purple-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex items-center gap-4 px-4 py-3">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative bg-amber-50">
        {photoUrls?.[0] ? (
          <Image src={photoUrls[0]} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
            No photo
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-stone-800">{name}</span>
          <span className="text-stone-400 text-sm">{species}</span>
          {sex && <span className="text-stone-400 text-sm capitalize">· {sex}</span>}
        </div>
        <p className="text-stone-400 text-xs mt-0.5">
          {[breed, ageYears != null ? `${ageYears} yr${ageYears !== 1 ? 's' : ''}` : null]
            .filter(Boolean).join(' · ')}
        </p>
        <p className="text-stone-300 text-xs mt-0.5">
          Added {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Status badge */}
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${statusStyles[status] ?? 'bg-stone-100 text-stone-500'}`}>
        {status}
      </span>

      {/* Actions */}
      <AnimalRowActions animalId={id} />
    </div>
  )
}
