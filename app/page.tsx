export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Home, Users, Mail, Phone, CalendarDays, MapPin } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import HeroSlideshow from '@/components/HeroSlideshow'
import FacebookBanner from '@/components/FacebookBanner'

async function getActiveDonation() {
  try {
    const { data, error } = await getSupabase()
      .from('donations')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()
    if (error) return null
    return data
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [donation] = await Promise.all([
    getActiveDonation(),
  ])

  const progressPercent = donation
    ? Math.min(Math.round((donation.current_amount / donation.goal_amount) * 100), 100)
    : 0

  return (
    <div>

      {/* ── HERO SLIDESHOW ───────────────────────────────────────── */}
      {/* Client component — cycles through rescue photos automatically */}
      <HeroSlideshow />

      {/* ── IMPACT BAR ───────────────────────────────────────────── */}
      <div className="bg-[#D4A017] text-[#2D1606] py-3 px-4">
        <p className="text-center text-sm font-bold uppercase tracking-wider leading-relaxed">
          Nonprofit · Eastern Montana · Est. August 2024<br className="sm:hidden" />
          <span className="hidden sm:inline"> · </span>Rescue · Vet · Rehome · Community Supported
        </p>
      </div>

      {/* ── OUR STORY ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-14 items-start">

          {/* Logo + contact */}
          <div className="flex-shrink-0 flex flex-col items-center gap-5 lg:sticky lg:top-24 w-full lg:w-auto">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-md">
              <Image
                src="/logo.png"
                alt="Annie Oakley Animal Rescue"
                width={160}
                height={160}
                className="rounded"
              />
            </div>
            <div className="flex flex-col items-center gap-2 text-sm font-medium">
              <a href="tel:4064890382" className="flex items-center gap-2 text-[#D4A017] hover:underline">
                <Phone className="w-4 h-4" /> (406) 489-0382
              </a>
              <a href="tel:4064780042" className="flex items-center gap-2 text-[#D4A017] hover:underline">
                <Phone className="w-4 h-4" /> (406) 478-0042
              </a>
              <a href="mailto:annieoakleyanimalrescue@gmail.com" className="flex items-center gap-2 text-[#D4A017] hover:underline text-center text-xs">
                <Mail className="w-4 h-4" /> annieoakleyanimalrescue@gmail.com
              </a>
            </div>
          </div>

          {/* Story */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-1 bg-[#D4A017] rounded-full" />
              <h2 className="font-display text-3xl font-bold text-[#2D1606]">Our Story</h2>
            </div>

            <p className="text-stone-700 leading-relaxed">
              Annie Oakley Animal Rescue was established in{' '}
              <strong>August 2024</strong> by <strong>Buffy and Sarah</strong> — two women who
              refused to look away from the crisis facing animals in Eastern Montana.
            </p>

            <p className="text-stone-600 leading-relaxed">
              The rescue was born from heartbreak. Two dogs —{' '}
              <strong>Annie</strong>, a girl, and <strong>Oakley</strong>, a boy — were caught too
              late. Despite every effort, both passed shortly after they were finally reached. Their
              story became the foundation of everything this rescue stands for: that we cannot wait,
              we cannot look away, and we will never stop fighting for the ones who need us most.
            </p>

            <p className="text-stone-600 leading-relaxed">
              From day one, Annie Oakley has been powered by the incredible{' '}
              <strong>support of this community</strong> and the dedication of{' '}
              <strong>local veterinary partners</strong> who believe every animal — regardless of
              circumstance — deserves proper medical care. Together, we pull animals from desperate
              situations, provide full veterinary treatment, and work to control the stray population
              across Eastern Montana.
            </p>

            <blockquote className="border-l-4 border-[#D4A017] pl-5 py-1 italic text-[#2D1606] font-display text-lg font-semibold bg-amber-50 rounded-r-lg">
              "Named for two dogs we couldn't save in time — built so that never happens again."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── FACILITY GOAL ────────────────────────────────────────── */}
      {/* Moved directly under Our Story per request */}
      <section id="donate" className="py-20 px-4 bg-amber-50">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-7 text-center">
          <div className="w-12 h-1 bg-[#D4A017] rounded-full" />
          <h2 className="font-display text-4xl font-bold text-[#2D1606]">Our Dream Facility</h2>

          <p className="text-stone-600 leading-relaxed text-lg">
            Every dollar donated to Annie Oakley goes directly to the animals in our care first —
            covering veterinary bills, surgeries, medications, food, and everything they need to
            heal and thrive.
          </p>

          <p className="text-stone-600 leading-relaxed">
            A portion of each donation is also set aside toward something bigger: our dream of building
            a <strong className="text-[#2D1606]">self-sustaining rescue facility</strong> right here in
            Eastern Montana. This facility will include professional grooming and boarding services —
            generating the revenue needed to fund our rescue operations long-term, meet a real gap in
            services our community is missing, and create meaningful local jobs. Our goal is to raise{' '}
            <strong className="text-[#2D1606]">$2,000,000</strong> to make that vision a reality.
          </p>

          {/* Progress bar */}
          {donation && (
            <div className="w-full flex flex-col gap-4">
              <div className="w-full bg-amber-200 rounded-full h-6 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#D4A017] to-yellow-400 h-6 rounded-full transition-all duration-700 flex items-center justify-end pr-3"
                  style={{ width: `${progressPercent}%` }}
                >
                  {progressPercent > 8 && (
                    <span className="text-[#2D1606] text-xs font-bold">{progressPercent}%</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-[#D4A017]">${donation.current_amount.toLocaleString()} raised</span>
                <span className="text-stone-400">Goal: $2,000,000</span>
              </div>
            </div>
          )}

          <a
            href="https://venmo.com/CareMt24"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#D4A017] text-[#2D1606] px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-[#D4A017]/30"
          >
            Donate via Venmo
          </a>
        </div>
      </section>

      {/* ── FETCH THE FINISH LINE FUN RUN ────────────────────────── */}
      <section className="py-20 px-4 bg-[#2D1606] relative overflow-hidden">
        {/* background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d1e08] via-[#2D1606] to-[#1a0d03] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent" />

        <div className="relative max-w-5xl mx-auto">
          {/* Top badge */}
          <div className="flex justify-center mb-8">
            <span className="bg-[#D4A017] text-[#2D1606] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-lg shadow-[#D4A017]/30">
              Upcoming Fundraiser Event · June 20, 2026
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Fun Run logo */}
            <div className="flex-shrink-0">
              <div className="relative w-52 h-52 drop-shadow-2xl">
                <Image
                  src="/fetch-5k.png"
                  alt="Fetch the Finish Line Fun Run"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-5 text-center lg:text-left">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
                  Fetch the Finish Line Fun Run
                </h2>
                <p className="text-amber-100/60 mt-1.5">Hosted by Winter Howlers</p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-amber-100/70">
                <span className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#D4A017]" /> June 20, 2026 · 7:00 AM
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4A017]" /> Sharbono Park · Fairview, MT
                </span>
              </div>

              <p className="text-amber-100/70 leading-relaxed">
                Run or walk through Fairview and support Annie Oakley Animal Rescue. Every registration goes
                directly toward the animals in our care.
              </p>

              {/* Entry fee callout */}
              <div className="flex justify-center lg:justify-start">
                <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-[#D4A017] text-2xl font-display font-bold">$40</p>
                    <p className="text-amber-100/60 text-xs">Adults</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <p className="text-white text-2xl font-display font-bold">Free</p>
                    <p className="text-amber-100/60 text-xs">5 &amp; Under</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/events/5k-signup"
                  className="bg-[#D4A017] text-[#2D1606] px-8 py-3.5 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-[#D4A017]/40 text-center"
                >
                  Register Now →
                </Link>
                <Link
                  href="/events"
                  className="border border-white/20 text-amber-100/70 px-8 py-3.5 rounded-full font-semibold hover:border-white/50 hover:text-white transition-colors text-sm text-center"
                >
                  View All Events
                </Link>
              </div>
            </div>

            {/* Hoopfest logo */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="bg-white rounded-2xl p-3 shadow-xl">
                <div className="relative w-28 h-24">
                  <Image
                    src="/hoopfest-logo.png"
                    alt="Hoopfest Border Town"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-amber-100/50 text-xs font-semibold uppercase tracking-wide">Part of Hoopfest</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW CAN YOU HELP ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-[#D4A017] mx-auto mb-4 rounded-full" />
            <h2 className="font-display text-4xl font-bold text-[#2D1606]">How Can You Help?</h2>
            <p className="text-stone-500 mt-2 text-lg">Every action — big or small — changes a life.</p>
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
              description="Help with transport, events, social media, and fundraising. Every single hour makes a difference."
              href="/volunteer"
              Icon={Users}
            />
          </div>
        </div>
      </section>

      <FacebookBanner />

    </div>
  )
}

// ── Action Card ───────────────────────────────────────────────────
function ActionCard({
  title, description, href, Icon,
}: {
  title: string; description: string; href: string; Icon: React.ElementType
}) {
  return (
    <Link
      href={href}
      className="bg-amber-50 border border-amber-100 hover:border-[#D4A017] rounded-2xl p-7 flex flex-col gap-4 transition-all hover:shadow-xl hover:shadow-[#D4A017]/10 group"
    >
      <div className="w-12 h-12 rounded-xl bg-[#D4A017]/15 flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#D4A017]" />
      </div>
      <h3 className="font-display text-xl font-bold text-[#2D1606] group-hover:text-[#D4A017] transition-colors">
        {title}
      </h3>
      <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
      <span className="text-[#D4A017] text-sm font-semibold mt-auto">Learn more →</span>
    </Link>
  )
}
