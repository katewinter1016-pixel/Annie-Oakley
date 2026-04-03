import Image from 'next/image'
import Link from 'next/link'
import { Heart, Home, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function getActiveDonation() {
  const { data } = await supabase
    .from('donations')
    .select('*')
    .eq('is_active', true)
    .single()
  return data
}

async function getFeaturedAnimals() {
  const { data } = await supabase
    .from('animals')
    .select('id, name, species, breed, photo_urls, status')
    .eq('status', 'available')
    .limit(3)
  return data ?? []
}

export default async function HomePage() {
  const [donation, animals] = await Promise.all([
    getActiveDonation(),
    getFeaturedAnimals(),
  ])

  const progressPercent = donation
    ? Math.min(Math.round((donation.current_amount / donation.goal_amount) * 100), 100)
    : 0

  return (
    <div>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      {/* Split layout: text on the left, image fully visible on the right */}
      <section className="max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">

        {/* Left: headline and CTAs */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-5xl font-bold leading-tight">
            We show up<br />
            <span className="text-[#D4A017]">when it matters most.</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
            When an animal's life is on the line in Eastern Montana, Annie Oakley Animal Rescue
            answers the call. We pull them from impossible situations, get them the care they need,
            and fight every single day to find them a home where they belong.
          </p>
          <p className="text-[#D4A017] font-semibold text-lg">
            Every life is worth saving. We believe that without exception.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/animals"
              className="bg-[#D4A017] text-[#1a1a1a] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
            >
              Meet Our Animals
            </Link>
            <Link
              href="/adopt"
              className="border border-[#D4A017] text-[#D4A017] px-6 py-3 rounded-full font-bold hover:bg-[#D4A017] hover:text-[#1a1a1a] transition-colors"
            >
              Apply to Adopt
            </Link>
          </div>
        </div>

        {/* Right: full image — all animals visible */}
        <div className="flex-shrink-0 w-full lg:w-[380px]">
          <Image
            src="/hero-pets.png"
            alt="Rescue animals"
            width={380}
            height={500}
            className="rounded-2xl object-cover w-full"
            priority
          />
        </div>
      </section>

      {/* ── MISSION / FOUNDERS STORY ─────────────────────────────── */}
      <section className="bg-[#111] py-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">
          <Image
            src="/logo.png"
            alt="Annie Oakley Animal Rescue Logo"
            width={88}
            height={88}
            className="rounded bg-white p-1"
          />
          <h2 className="text-2xl font-bold text-[#D4A017]">Our Story</h2>
          <p className="text-gray-300 leading-relaxed">
            Annie Oakley Animal Rescue was founded by <strong className="text-white">Buffy and Sarah</strong> — two women who
            looked at the crisis facing animals in Eastern Montana and decided someone had to act.
            Faced with animals in life-or-death situations and a community with nowhere to turn,
            they built something from nothing: a nonprofit rescue rooted in urgency, compassion,
            and an unshakable belief that every animal deserves a fighting chance.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Since opening our doors, Annie Oakley has pulled hundreds of animals from desperate
            circumstances — vetting them, rehabilitating them, and placing them in loving forever homes.
            We also work alongside our community to control the stray population and reduce the suffering
            that comes with it. This rescue is personal. It always has been.
          </p>
          <a href="tel:4064890382" className="text-[#D4A017] hover:underline font-medium">
            (406) 489-0382
          </a>
        </div>
      </section>

      {/* ── HOW CAN YOU HELP ─────────────────────────────────────── */}
      {/* Three action cards — Surrender removed per request */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How Can You Help?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ActionCard
            title="Adopt"
            description="Give a rescue animal their forever home. Browse our available dogs and cats and start your application today."
            href="/adopt"
            Icon={Heart}
          />
          <ActionCard
            title="Foster"
            description="Provide a temporary home while we find the right permanent placement. Every foster saves a life."
            href="/foster"
            Icon={Home}
          />
          <ActionCard
            title="Volunteer"
            description="Help with transport, events, social media, fundraising, and more. Every hour makes a difference."
            href="/volunteer"
            Icon={Users}
          />
        </div>
      </section>

      {/* ── FEATURED ANIMALS ─────────────────────────────────────── */}
      {/* Shows up to 3 available animals. When the DB is empty, shows a prompt. */}
      <section className="bg-[#111] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Animals Looking for Homes</h2>

          {animals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {animals.map((animal) => (
                <Link
                  key={animal.id}
                  href={`/animals/${animal.id}`}
                  className="bg-[#1a1a1a] border border-gray-700 hover:border-[#D4A017] rounded-2xl overflow-hidden transition-colors group"
                >
                  <div className="h-48 bg-gray-800 relative">
                    {animal.photo_urls?.[0] ? (
                      <Image
                        src={animal.photo_urls[0]}
                        alt={animal.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        No photo yet
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg group-hover:text-[#D4A017] transition-colors">
                      {animal.name}
                    </h3>
                    <p className="text-gray-400 text-sm capitalize">
                      {animal.species}{animal.breed ? ` · ${animal.breed}` : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-10">
              Check back soon — we're always updating our available animals.
            </p>
          )}

          <div className="text-center">
            <Link
              href="/animals"
              className="bg-[#D4A017] text-[#1a1a1a] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
            >
              See All Animals
            </Link>
          </div>
        </div>
      </section>

      {/* ── FACILITY GOAL / DONATION METER ───────────────────────── */}
      {/* Comes after the animals section. Shows live progress from Supabase. */}
      {donation && (
        <section id="donate" className="py-16 px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-bold text-[#D4A017]">Facility Goal</h2>
            <p className="text-gray-300">{donation.description}</p>

            {/* Progress bar — the yellow fill width is calculated as a percentage */}
            <div className="w-full bg-gray-800 rounded-full h-5 overflow-hidden">
              <div
                className="bg-[#D4A017] h-5 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between w-full text-sm text-gray-400">
              <span>${donation.current_amount.toLocaleString()} raised</span>
              <span>{progressPercent}% of ${donation.goal_amount.toLocaleString()} goal</span>
            </div>

            <a
              href="https://www.paypal.com/qrcodes/venmocs/2d035337-a8f0-43c4-8781-5a5627f0e065"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D4A017] text-[#1a1a1a] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
            >
              Donate
            </a>
          </div>
        </section>
      )}

    </div>
  )
}

// ── Action Card with Lucide icon ──────────────────────────────────
// Icons from lucide-react are clean, professional SVG icons — no emojis.
function ActionCard({
  title,
  description,
  href,
  Icon,
}: {
  title: string
  description: string
  href: string
  Icon: React.ElementType
}) {
  return (
    <Link
      href={href}
      className="bg-[#222] border border-gray-700 hover:border-[#D4A017] rounded-2xl p-6 flex flex-col gap-3 transition-colors group"
    >
      <Icon className="w-8 h-8 text-[#D4A017]" />
      <h3 className="text-lg font-bold group-hover:text-[#D4A017] transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </Link>
  )
}
