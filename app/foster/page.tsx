import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import FacebookBanner from '@/components/FacebookBanner'

export const dynamic = 'force-dynamic'

async function getAnimals() {
  const { data } = await supabase
    .from('animals')
    .select('id, name, species, breed, age_years, sex, description, photo_urls, status, listing_type')
    .eq('status', 'available')
    .in('listing_type', ['foster', 'both'])
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function FosterPage() {
  const animals = await getAnimals()

  const dogs = animals.filter((a) => a.species?.toLowerCase() === 'dog')
  const cats = animals.filter((a) => a.species?.toLowerCase() === 'cat')
  const others = animals.filter(
    (a) => a.species?.toLowerCase() !== 'dog' && a.species?.toLowerCase() !== 'cat'
  )

  return (
    <div className="bg-amber-50 min-h-screen">
      {/* Header */}
      <FacebookBanner />
      <div className="bg-[#2D1606] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="w-12 h-1 bg-[#D4A017] mb-5 rounded-full" />
          <h1 className="font-display text-5xl font-bold text-[#D4A017] mb-3">
            Foster a Rescue Animal
          </h1>
          <p className="text-amber-50/80 text-lg max-w-2xl">
            Fostering is one of the most powerful things you can do. You provide a safe,
            loving home while we find the perfect forever family. Browse the animals
            below and apply to foster any one of them.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14 flex flex-col gap-16">

        {animals.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-stone-400 text-lg">No animals listed yet — check back soon!</p>
            <Link href="/foster/apply" className="text-[#D4A017] hover:underline font-semibold">
              Submit a general foster application
            </Link>
          </div>
        )}

        {dogs.length > 0 && (
          <AnimalCategory title="Dogs" animals={dogs} formPath="/foster/apply" />
        )}

        {cats.length > 0 && (
          <AnimalCategory title="Cats" animals={cats} formPath="/foster/apply" />
        )}

        {others.length > 0 && (
          <AnimalCategory title="Other Animals" animals={others} formPath="/foster/apply" />
        )}

      </div>

      <div className="bg-[#2D1606] py-12 px-4 text-center">
        <p className="text-amber-50/70 mb-4 font-display">Want to foster but don't see the right fit? Submit a general application and we'll match you.</p>
        <Link
          href="/foster/apply"
          className="inline-block bg-[#D4A017] text-[#2D1606] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
        >
          Apply Without Selecting an Animal
        </Link>
      </div>
    </div>
  )
}

function AnimalCategory({ title, animals, formPath }: {
  title: string
  animals: {
    id: string; name: string; species: string; breed: string | null
    age_years: number | null; sex: string | null; description: string | null; photo_urls: string[] | null
  }[]
  formPath: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-8 h-1 bg-[#D4A017] rounded-full" />
        <h2 className="font-display text-3xl font-bold text-[#2D1606]">{title}</h2>
        <div className="flex-1 h-px bg-amber-100" />
      </div>
      <div className="flex flex-col gap-5">
        {animals.map((animal) => (
          <AnimalRow key={animal.id} animal={animal} formPath={formPath} />
        ))}
      </div>
    </div>
  )
}

function AnimalRow({ animal, formPath }: {
  animal: {
    id: string; name: string; species: string; breed: string | null
    age_years: number | null; sex: string | null; description: string | null; photo_urls: string[] | null
  }
  formPath: string
}) {
  const sexLabel = animal.sex ? animal.sex.charAt(0).toUpperCase() + animal.sex.slice(1) : null
  const ageLabel = animal.age_years != null ? `${animal.age_years} yr${animal.age_years !== 1 ? 's' : ''}` : null

  return (
    <div className="bg-white border border-amber-100 rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md hover:border-[#D4A017]/40 transition-all">
      <div className="sm:w-56 sm:flex-shrink-0 h-52 sm:h-auto relative bg-amber-50">
        {animal.photo_urls?.[0] ? (
          <Image src={animal.photo_urls[0]} alt={animal.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">Photo coming soon</div>
        )}
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="font-display text-2xl font-bold text-[#2D1606]">{animal.name}</h3>
            {sexLabel && <span className="text-sm font-semibold text-[#D4A017]">{sexLabel}</span>}
          </div>
          <p className="text-stone-400 text-sm">{[ageLabel, animal.breed].filter(Boolean).join(' · ')}</p>
          {animal.description && (
            <p className="text-stone-600 text-sm leading-relaxed mt-1 line-clamp-3">{animal.description}</p>
          )}
        </div>
        <Link
          href={`${formPath}?animal=${animal.id}`}
          className="self-start bg-[#D4A017] text-[#2D1606] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-md shadow-[#D4A017]/20"
        >
          Apply to Foster {animal.name}
        </Link>
      </div>
    </div>
  )
}
