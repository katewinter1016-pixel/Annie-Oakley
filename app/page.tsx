import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// This page runs on the server every time someone visits.
// It fetches the active donation campaign from Supabase before the page loads.
async function getActiveDonation() {
  const { data } = await supabase
    .from('donations')
    .select('*')
    .eq('is_active', true)
    .single()
  return data
}

export default async function HomePage() {
  const donation = await getActiveDonation()
  const progressPercent = donation
    ? Math.min(Math.round((donation.current_amount / donation.goal_amount) * 100), 100)
    : 0

  return (
    <div>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      {/* This is the first thing visitors see — a big banner with the
          watercolor image and a call to action */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        {/* Background image with a dark overlay so text is readable */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-pets.png"
            alt="Adoptable animals"
            fill
            className="object-cover object-top opacity-30"
            priority
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 flex flex-col gap-6">
          <h1 className="text-5xl font-bold leading-tight">
            Every animal deserves<br />
            <span className="text-[#D4A017]">a second chance.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Annie Oakley Animal Rescue saves animals in life or death situations across Eastern Montana.
            We rescue, vet, and rehome dogs and cats — and we need your help.
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
      </section>

      {/* ── MISSION SECTION ──────────────────────────────────────── */}
      <section className="bg-[#111] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-full bg-white p-1" />
          <h2 className="text-2xl font-bold text-[#D4A017]">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            Annie Oakley Animal Rescue is a nonprofit organization located in Eastern Montana.
            We rescue animals in life or death situations, provide full veterinary care, and find
            them loving forever homes. We also work with our community to control the stray population
            and give every animal a fighting chance.
          </p>
          <a
            href="tel:4064890382"
            className="text-[#D4A017] hover:underline mt-2"
          >
            (406) 489-0382
          </a>
        </div>
      </section>

      {/* ── ACTION CARDS ─────────────────────────────────────────── */}
      {/* Four big tiles that direct visitors to the most important actions */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How Can You Help?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <ActionCard
            title="Adopt"
            description="Give a rescue animal their forever home. Browse our available dogs and cats."
            href="/adopt"
            emoji="🏠"
          />
          <ActionCard
            title="Foster"
            description="Temporarily care for an animal while we find them a permanent home."
            href="/foster"
            emoji="🤝"
          />
          <ActionCard
            title="Volunteer"
            description="Help with transport, events, social media, and more. Every hour counts."
            href="/volunteer"
            emoji="💛"
          />
          <ActionCard
            title="Surrender"
            description="If you can no longer care for your animal, we can help find them a safe place."
            href="/surrender"
            emoji="🐾"
          />
        </div>
      </section>

      {/* ── DONATION METER ───────────────────────────────────────── */}
      {/* This section shows live fundraising progress pulled from Supabase */}
      {donation && (
        <section id="donate" className="bg-[#111] py-16 px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-bold text-[#D4A017]">{donation.campaign_name}</h2>
            <p className="text-gray-300">{donation.description}</p>

            {/* The progress bar — the inner yellow bar width changes based on % raised */}
            <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden">
              <div
                className="bg-[#D4A017] h-6 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between w-full text-sm text-gray-400">
              <span>${donation.current_amount.toLocaleString()} raised</span>
              <span>{progressPercent}% of ${donation.goal_amount.toLocaleString()} goal</span>
            </div>

            {/* PayPal donate link from the Facebook page */}
            <a
              href="https://www.paypal.com/qrcodes/venmocs/2d035337-a8f0-43c4-8781-5a5627f0e065"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D4A017] text-[#1a1a1a] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
            >
              Donate via PayPal
            </a>
          </div>
        </section>
      )}

    </div>
  )
}

// ── Reusable Action Card component ───────────────────────────────
// A "component" is a reusable piece of UI. We define it once here and
// use it four times above for the four action cards. Much cleaner than
// copy-pasting the same HTML block four times.
function ActionCard({
  title,
  description,
  href,
  emoji,
}: {
  title: string
  description: string
  href: string
  emoji: string
}) {
  return (
    <Link
      href={href}
      className="bg-[#222] border border-gray-700 hover:border-[#D4A017] rounded-2xl p-6 flex flex-col gap-3 transition-colors group"
    >
      <span className="text-4xl">{emoji}</span>
      <h3 className="text-lg font-bold group-hover:text-[#D4A017] transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </Link>
  )
}
