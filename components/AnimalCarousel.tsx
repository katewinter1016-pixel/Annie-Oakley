'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Animal = {
  id: string
  name: string
  species: string
  breed: string | null
  photo_urls: string[] | null
}

export default function AnimalCarousel({ animals }: { animals: Animal[] }) {
  const [current, setCurrent] = useState(0)

  // How many cards to show depends on screen — we handle this with CSS,
  // but for the logic we always move one at a time
  const total = animals.length

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (total <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [total])

  if (animals.length === 0) {
    return (
      <p className="text-center text-stone-400 py-10">
        Check back soon — we're always adding new animals looking for homes.
      </p>
    )
  }

  // Show up to 3 cards centered around the current one
  const visible = [-1, 0, 1]
    .map((offset) => animals[(current + offset + total) % total])

  return (
    <div className="relative">
      {/* Cards */}
      <div className="flex gap-6 justify-center items-stretch overflow-hidden px-4">
        {visible.map((animal, i) => {
          const isCenter = i === 1
          return (
            <Link
              key={`${animal.id}-${i}`}
              href={`/animals/${animal.id}`}
              className={`flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 group ${
                isCenter
                  ? 'scale-105 shadow-xl shadow-[#D4A017]/20 border-2 border-[#D4A017]'
                  : 'opacity-60 scale-95 hidden sm:block'
              }`}
            >
              <div className="h-56 relative bg-amber-100">
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
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-bold text-stone-800 group-hover:text-[#D4A017] transition-colors">
                  {animal.name}
                </h3>
                <p className="text-stone-500 text-sm capitalize mt-1">
                  {animal.species}{animal.breed ? ` · ${animal.breed}` : ''}
                </p>
                {isCenter && (
                  <span className="inline-block mt-3 text-[#D4A017] font-semibold text-sm">
                    Learn more →
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-[#D4A017] hover:text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-[#D4A017] hover:text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {animals.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'bg-[#D4A017] w-6' : 'bg-stone-300 w-2'
            }`}
            aria-label={`Animal ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
