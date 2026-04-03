import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Heart, Home, Check, X } from 'lucide-react'

// Fetch one animal by its ID from the URL
async function getAnimal(id: string) {
  const { data } = await supabase
    .from('animals')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export default async function AnimalDetailPage({ params }: { params: { id: string } }) {
  const animal = await getAnimal(params.id)

  // If no animal found with this ID, show the 404 page
  if (!animal) notFound()

  const photos: string[] = animal.photo_urls ?? []

  const traits = [
    { label: 'Good with Kids', value: animal.good_with_kids },
    { label: 'Good with Dogs', value: animal.good_with_dogs },
    { label: 'Good with Cats', value: animal.good_with_cats },
  ]

  const details = [
    { label: 'Species', value: animal.species },
    { label: 'Breed', value: animal.breed },
    { label: 'Age', value: animal.age_years != null ? `${animal.age_years} year${animal.age_years !== 1 ? 's' : ''}` : null },
    { label: 'Sex', value: animal.sex },
    { label: 'Size', value: animal.size },
    { label: 'Status', value: animal.status },
  ].filter((d) => d.value)

  return (
    <div>

      {/* ── BACK LINK ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-amber-100 py-3 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/animals" className="text-sm text-stone-500 hover:text-[#D4A017] transition-colors font-medium">
            ← Back to Animals
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── PHOTO SECTION ──────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Main photo */}
            <div className="w-full h-[420px] relative rounded-2xl overflow-hidden bg-amber-50 border border-amber-100">
              {photos[0] ? (
                <Image
                  src={photos[0]}
                  alt={animal.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  No photo yet
                </div>
              )}
            </div>

            {/* Thumbnail row — additional photos if available */}
            {photos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {photos.slice(1).map((url, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-24 h-24 relative rounded-xl overflow-hidden border border-amber-100"
                  >
                    <Image src={url} alt={`${animal.name} photo ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── ANIMAL INFO ────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Name + species badge */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] mb-2 block capitalize">
                {animal.species} · Available for Adoption
              </span>
              <h1 className="font-display text-5xl font-bold text-[#2D1606]">{animal.name}</h1>
            </div>

            {/* Quick details grid */}
            <div className="grid grid-cols-2 gap-3">
              {details.map((d) => (
                <div key={d.label} className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                  <p className="text-xs text-stone-400 uppercase tracking-wide font-semibold mb-0.5">{d.label}</p>
                  <p className="text-stone-700 font-semibold capitalize">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {animal.description && (
              <div>
                <h2 className="font-display text-xl font-bold text-[#2D1606] mb-2">About {animal.name}</h2>
                <p className="text-stone-600 leading-relaxed">{animal.description}</p>
              </div>
            )}

            {/* Compatibility */}
            <div>
              <h2 className="font-display text-xl font-bold text-[#2D1606] mb-3">Compatibility</h2>
              <div className="flex flex-col gap-2">
                {traits.map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    {value === true ? (
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                    ) : value === false ? (
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-stone-400 text-xs">?</span>
                      </div>
                    )}
                    <span className="text-stone-600 text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special needs */}
            {animal.special_needs && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-[#2D1606] mb-1">Special Needs / Notes</p>
                <p className="text-stone-600 text-sm">{animal.special_needs}</p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/adopt?animal=${animal.id}`}
                className="flex items-center justify-center gap-2 bg-[#D4A017] text-[#2D1606] px-6 py-4 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-[#D4A017]/20 flex-1"
              >
                <Heart className="w-5 h-5" />
                Apply to Adopt {animal.name}
              </Link>
              <Link
                href={`/foster?animal=${animal.id}`}
                className="flex items-center justify-center gap-2 border-2 border-[#2D1606] text-[#2D1606] px-6 py-4 rounded-full font-bold hover:bg-[#2D1606] hover:text-white transition-colors flex-1"
              >
                <Home className="w-5 h-5" />
                Apply to Foster
              </Link>
            </div>

            {/* Contact note */}
            <p className="text-stone-400 text-sm text-center">
              Questions? Call us at{' '}
              <a href="tel:4064890382" className="text-[#D4A017] hover:underline font-medium">
                (406) 489-0382
              </a>
            </p>

          </div>
        </div>
      </div>

    </div>
  )
}
