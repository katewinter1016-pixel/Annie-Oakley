import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

// Fetch all available animals from Supabase
async function getAnimals(species?: string) {
  let query = supabase
    .from('animals')
    .select('id, name, species, breed, age_years, sex, size, photo_urls, status, good_with_kids, good_with_dogs, good_with_cats')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (species && species !== 'all') {
    query = query.eq('species', species)
  }

  const { data } = await query
  return data ?? []
}

// Next.js passes URL search params (like ?species=dog) into the page automatically
export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: { species?: string }
}) {
  const species = searchParams.species ?? 'all'
  const animals = await getAnimals(species)

  const filters = [
    { label: 'All Animals', value: 'all' },
    { label: 'Dogs', value: 'dog' },
    { label: 'Cats', value: 'cat' },
    { label: 'Other', value: 'other' },
  ]

  return (
    <div>

      {/* ── PAGE HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#2D1606] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="w-12 h-1 bg-[#D4A017] mb-5 rounded-full" />
          <h1 className="font-display text-5xl font-bold mb-3">
            Find Your <span className="text-[#D4A017]">Forever Friend</span>
          </h1>
          <p className="text-amber-200/80 text-lg max-w-xl">
            Every animal here has been rescued, vetted, and is ready for a loving home.
            They've been through a lot — and they're worth every bit of it.
          </p>
        </div>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────────── */}
      {/* These buttons filter the list by species without a full page reload —
          they work by changing the URL (e.g. ?species=dog) */}
      <div className="bg-white border-b border-amber-100 sticky top-[73px] z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto">
          {filters.map((f) => (
            <Link
              key={f.value}
              href={f.value === 'all' ? '/animals' : `/animals?species=${f.value}`}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                species === f.value
                  ? 'bg-[#D4A017] text-[#2D1606]'
                  : 'bg-amber-50 text-stone-600 hover:bg-amber-100'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── ANIMAL GRID ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {animals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          /* Empty state — shown when no animals match the filter */
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="text-6xl">🐾</div>
            <h2 className="font-display text-2xl font-bold text-[#2D1606]">
              No animals listed yet
            </h2>
            <p className="text-stone-500 max-w-sm">
              We're always rescuing new animals. Check back soon or follow us on
              Facebook for real-time updates.
            </p>
            <Link
              href="/"
              className="mt-4 bg-[#D4A017] text-[#2D1606] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>

      {/* ── CTA STRIP ────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-t border-amber-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
          <h2 className="font-display text-2xl font-bold text-[#2D1606]">
            Not seeing the right match?
          </h2>
          <p className="text-stone-500">
            Submit a foster or adoption application and tell us what you're looking for —
            we'll reach out when the right animal comes in.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/adopt"
              className="bg-[#D4A017] text-[#2D1606] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
            >
              Adoption Application
            </Link>
            <Link
              href="/foster"
              className="border-2 border-[#2D1606] text-[#2D1606] px-6 py-3 rounded-full font-bold hover:bg-[#2D1606] hover:text-white transition-colors"
            >
              Foster Application
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

// ── Animal Card ───────────────────────────────────────────────────
function AnimalCard({ animal }: { animal: {
  id: string
  name: string
  species: string
  breed: string | null
  age_years: number | null
  sex: string | null
  size: string | null
  photo_urls: string[] | null
  good_with_kids: boolean | null
  good_with_dogs: boolean | null
  good_with_cats: boolean | null
}}) {
  const badges = [
    animal.good_with_kids && 'Good with kids',
    animal.good_with_dogs && 'Good with dogs',
    animal.good_with_cats && 'Good with cats',
  ].filter(Boolean) as string[]

  return (
    <Link
      href={`/animals/${animal.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 hover:border-[#D4A017] hover:shadow-xl hover:shadow-[#D4A017]/10 transition-all group"
    >
      {/* Photo */}
      <div className="h-60 relative bg-amber-50 overflow-hidden">
        {animal.photo_urls?.[0] ? (
          <Image
            src={animal.photo_urls[0]}
            alt={animal.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">
            Photo coming soon
          </div>
        )}
        {/* Species tag in top corner */}
        <span className="absolute top-3 left-3 bg-[#2D1606]/80 text-white text-xs font-bold px-3 py-1 rounded-full capitalize backdrop-blur-sm">
          {animal.species}
        </span>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-display text-2xl font-bold text-[#2D1606] group-hover:text-[#D4A017] transition-colors">
          {animal.name}
        </h3>

        {/* Breed, age, sex, size details */}
        <p className="text-stone-500 text-sm capitalize">
          {[animal.breed, animal.age_years != null && `${animal.age_years} yr${animal.age_years !== 1 ? 's' : ''}`, animal.sex, animal.size]
            .filter(Boolean)
            .join(' · ')}
        </p>

        {/* Compatibility badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {badges.map((b) => (
              <span key={b} className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                {b}
              </span>
            ))}
          </div>
        )}

        <span className="text-[#D4A017] font-semibold text-sm mt-2">Meet {animal.name} →</span>
      </div>
    </Link>
  )
}
