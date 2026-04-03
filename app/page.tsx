import Image from 'next/image'
import Link from 'next/link'
import { Heart, Home, Users, Mail, Phone } from 'lucide-react'
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
    <div className="overflow-x-hidden">

      {/* ── HERO — VIDEO BACKGROUND ──────────────────────────────── */}
      {/* The video plays silently on loop behind the text. A dark gradient
          overlay sits on top of it so the white text stays readable. */}
      <section className="relative min-h-[680px] flex items-center justify-center overflow-hidden">

        {/* Video layer */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mov" type="video/quicktime" />
          <source src="/hero-video.mov" type="video/mp4" />
        </video>

        {/* Gradient overlay — dark at left/bottom, slightly transparent at right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/80 to-[#1a1a1a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 w-full">
          {/* Yellow accent bar above headline */}
          <div className="w-16 h-1 bg-[#D4A017] mb-6 rounded-full" />

          <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-2xl mb-6">
            We show up<br />
            <span className="text-[#D4A017]">when it matters most.</span>
          </h1>

          <p className="text-gray-200 text-xl leading-relaxed max-w-xl mb-4">
            When an animal's life is on the line in Eastern Montana, Annie Oakley
            Animal Rescue answers the call — pulling them from impossible situations,
            getting them the care they need, and fighting to find them a home where
            they belong.
          </p>

          <p className="text-[#D4A017] font-semibold text-lg mb-10">
            Every life is worth saving. We believe that without exception.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/animals"
              className="bg-[#D4A017] text-[#1a1a1a] px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-[#D4A017]/20"
            >
              Meet Our Animals
            </Link>
            <Link
              href="/adopt"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#1a1a1a] transition-colors"
            >
              Apply to Adopt
            </Link>
          </div>
        </div>
      </section>

      {/* ── IMPACT BAR ───────────────────────────────────────────── */}
      {/* A quick visual punch of what the rescue stands for */}
      <div className="bg-[#D4A017] text-[#1a1a1a] py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-2 text-sm font-bold uppercase tracking-wide text-center">
          <span>Nonprofit · Eastern Montana</span>
          <span>·</span>
          <span>Established August 2024</span>
          <span>·</span>
          <span>Rescue · Vet · Rehome</span>
          <span>·</span>
          <span>Community Supported</span>
        </div>
      </div>

      {/* ── OUR STORY ────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-[#111] to-[#1a1a1a]">
        {/* Decorative side accent */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#D4A017] via-[#D4A017]/30 to-transparent" />

        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">

          {/* Logo / visual anchor */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-xl shadow-black/40">
              <Image
                src="/logo.png"
                alt="Annie Oakley Animal Rescue"
                width={160}
                height={160}
                className="rounded"
              />
            </div>
            {/* Contact info under logo */}
            <div className="flex flex-col items-center gap-2 text-sm">
              <a href="tel:4064890382" className="flex items-center gap-2 text-[#D4A017] hover:underline">
                <Phone className="w-4 h-4" /> (406) 489-0382
              </a>
              <a href="mailto:annieoakleyanimalrescue@gmail.com" className="flex items-center gap-2 text-[#D4A017] hover:underline text-center">
                <Mail className="w-4 h-4" /> annieoakleyanimalrescue@gmail.com
              </a>
            </div>
          </div>

          {/* Story text */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-1 bg-[#D4A017] rounded-full" />
              <h2 className="text-3xl font-bold text-[#D4A017]">Our Story</h2>
            </div>

            <p className="text-gray-200 leading-relaxed">
              Annie Oakley Animal Rescue was established in <strong className="text-white">August 2024</strong> by{' '}
              <strong className="text-white">Buffy and Sarah</strong> — two women who witnessed firsthand
              what happens when animals in crisis have nowhere to turn.
            </p>

            <p className="text-gray-300 leading-relaxed">
              The rescue was born from heartbreak. Two dogs — <strong className="text-white">Annie</strong>, a girl,
              and <strong className="text-white">Oakley</strong>, a boy — were caught too late. Despite the community's
              efforts to help them, both dogs passed shortly after they were finally reached. Their story
              became the foundation of everything this rescue stands for: that we cannot wait, we cannot
              look away, and we cannot stop fighting for the ones who need us most.
            </p>

            <p className="text-gray-300 leading-relaxed">
              From day one, Annie Oakley Animal Rescue has been powered by{' '}
              <strong className="text-white">community support</strong> and the dedication of{' '}
              <strong className="text-white">local veterinary partners</strong> who believe every animal
              deserves proper medical care regardless of circumstance. Together, we rescue animals from
              life-or-death situations, provide full veterinary care, and work to control the stray
              population across Eastern Montana — one life at a time.
            </p>

            {/* Highlighted quote */}
            <blockquote className="border-l-4 border-[#D4A017] pl-4 text-[#D4A017] font-semibold italic">
              "Named for two dogs we couldn't save in time — built so that never happens again."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── HOW CAN YOU HELP ─────────────────────────────────────── */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-[#D4A017] mx-auto mb-4 rounded-full" />
            <h2 className="text-3xl font-bold">How Can You Help?</h2>
            <p className="text-gray-400 mt-2">Every action — big or small — changes a life.</p>
          </div>

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
        </div>
      </section>

      {/* ── FEATURED ANIMALS ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#111] to-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-[#D4A017] mx-auto mb-4 rounded-full" />
            <h2 className="text-3xl font-bold">Animals Looking for Homes</h2>
            <p className="text-gray-400 mt-2">These are the ones waiting for you right now.</p>
          </div>

          {animals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {animals.map((animal) => (
                <Link
                  key={animal.id}
                  href={`/animals/${animal.id}`}
                  className="bg-[#1a1a1a] border border-gray-800 hover:border-[#D4A017] rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-[#D4A017]/10 group"
                >
                  <div className="h-52 bg-gray-900 relative">
                    {animal.photo_urls?.[0] ? (
                      <Image
                        src={animal.photo_urls[0]}
                        alt={animal.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        Photo coming soon
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg group-hover:text-[#D4A017] transition-colors">{animal.name}</h3>
                    <p className="text-gray-400 text-sm capitalize mt-1">
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
              className="bg-[#D4A017] text-[#1a1a1a] px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-[#D4A017]/20"
            >
              See All Animals
            </Link>
          </div>
        </div>
      </section>

      {/* ── FACILITY GOAL / DONATION METER ───────────────────────── */}
      {donation && (
        <section id="donate" className="py-20 px-4 bg-[#1a1a1a] relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-[#D4A017]/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
            <div className="w-12 h-1 bg-[#D4A017] mx-auto rounded-full" />
            <h2 className="text-3xl font-bold">Facility Goal</h2>
            <p className="text-gray-300 leading-relaxed">{donation.description}</p>

            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4A017] to-yellow-300 h-5 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between w-full text-sm">
              <span className="text-[#D4A017] font-semibold">${donation.current_amount.toLocaleString()} raised</span>
              <span className="text-gray-400">{progressPercent}% of ${donation.goal_amount.toLocaleString()} goal</span>
            </div>

            <a
              href="https://www.paypal.com/qrcodes/venmocs/2d035337-a8f0-43c4-8781-5a5627f0e065"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D4A017] text-[#1a1a1a] px-10 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-[#D4A017]/20"
            >
              Donate
            </a>
          </div>
        </section>
      )}

    </div>
  )
}

// ── Action Card ───────────────────────────────────────────────────
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
      className="bg-gradient-to-b from-[#252525] to-[#1e1e1e] border border-gray-700 hover:border-[#D4A017] rounded-2xl p-7 flex flex-col gap-4 transition-all hover:shadow-lg hover:shadow-[#D4A017]/10 group"
    >
      <div className="w-12 h-12 rounded-xl bg-[#D4A017]/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#D4A017]" />
      </div>
      <h3 className="text-lg font-bold group-hover:text-[#D4A017] transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <span className="text-[#D4A017] text-sm font-semibold mt-auto">Learn more →</span>
    </Link>
  )
}
