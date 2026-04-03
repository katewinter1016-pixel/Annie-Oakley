'use client'

// "use client" means this component runs in the browser, not on the server.
// We need this because the slideshow uses React state (which slide is active)
// and a timer (to auto-advance). Those only work in the browser.

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SLIDES = [
  '/rescue-photos/photo1.jpg',
  '/rescue-photos/photo2.jpg',
  '/rescue-photos/photo3.jpg',
  '/rescue-photos/photo4.jpg',
  '/rescue-photos/photo5.jpg',
  '/rescue-photos/photo6.jpg',
  '/rescue-photos/photo7.jpg',
  '/rescue-photos/photo8.jpg',
  '/rescue-photos/photo10.jpg',
  '/rescue-photos/photo11.jpg',
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  // Auto-advance: every 4 seconds, fade out → swap image → fade in
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length)
        setFading(false)
      }, 600)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 300)
  }

  return (
    <section className="relative min-h-[680px] flex items-center overflow-hidden">

      {/* Slideshow background image */}
      <div
        className="absolute inset-0 transition-opacity duration-600"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image
          key={current}
          src={SLIDES[current]}
          alt="Rescue animals"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Gradient overlay — left side darker for text legibility, right fades to show the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2D1606]/90 via-[#2D1606]/60 to-[#2D1606]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2D1606]/70 via-transparent to-transparent" />

      {/* Hero text */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="w-16 h-1 bg-[#D4A017] mb-6 rounded-full" />

        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight max-w-2xl mb-6 text-white drop-shadow-lg">
          We show up<br />
          <span className="text-[#D4A017]">when it matters most.</span>
        </h1>

        <p className="text-amber-100 text-xl leading-relaxed max-w-xl mb-4">
          When an animal's life is on the line in Eastern Montana, Annie Oakley
          Animal Rescue answers the call. We rescue, vet, and fight for every
          single one — until they find the home they deserve.
        </p>

        <p className="text-[#D4A017] font-semibold text-lg mb-10">
          Every life is worth saving. We believe that without exception.
        </p>

        <Link
          href="/animals"
          className="inline-block bg-[#D4A017] text-[#2D1606] px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors shadow-xl shadow-[#D4A017]/30"
        >
          Meet Our Animals
        </Link>
      </div>

      {/* Dot navigation — clicking a dot jumps to that slide */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-[#D4A017] w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
