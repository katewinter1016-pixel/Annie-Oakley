import Link from 'next/link'
import Image from 'next/image'
import { Heart, Home, Users, Mail, Phone, CalendarDays, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import HeroSlideshow from '@/components/HeroSlideshow'
import FacebookBanner from '@/components/FacebookBanner'

async function getActiveDonation() {
  const { data } = await supabase
    .from('donations')
    .select('*')
    .eq('is_active', true)
    .single()
  return data
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

      {/* ── UPCOMING EVENT ───────────────────────────────────────── */}
      <section className="py-20 px-4 bg-amber-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-[#D4A017] mx-auto mb-4 rounded-full" />
            <h2 className="font-display text-4xl font-bold text-[#2D1606]">Upcoming Event</h2>
            <p className="text-stone-500 mt-2 text-lg">Join us and make a difference.</p>
          </div>

          <div className="bg-[#2D1606] rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center gap-0 shadow-2xl">
            {/* Logo */}
            <div className="lg:w-80 flex-shrink-0 flex items-center justify-center p-10 bg-[#2D1606]">
              <div className="relative w-56 h-56">
                <Image src="/fetch-5k.png" alt="Fetch the Finish Line 5K Run" fill className="object-contain drop-shadow-xl" />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 p-8 lg:p-12 flex flex-col gap-5 text-center lg:text-left">
              <div>
                <span className="text-[#D4A017] text-xs font-bold uppercase tracking-widest">
                  Annie Oakley Animal Rescue Fundraiser
                </span>
                <h3 className="font-display text-4xl font-bold text-white mt-2 leading-tight">
                  Fetch the Finish Line<br /><span className="text-[#D4A017]">5K Run</span>
                </h3>
                <p className="text-amber-100/60 mt-1">Hosted by Winter Howlers</p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-amber-100/70">
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-[#D4A017]" /> Date &amp; details coming soon</span>
              </div>

              <p className="text-amber-100/60 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Lace up and bring your pups! Every sign-up goes directly toward our dream facility fund. Dogs welcome on leash. T-shirts will be available!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
                <Link
                  href="/events/5k-signup"
                  className="bg-[#D4A017] text-[#2D1606] px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-[#D4A017]/20"
                >
                  Sign Up Now
                </Link>
                <Link
                  href="/events"
                  className="border-2 border-amber-100/30 text-amber-100 px-8 py-4 rounded-full font-bold text-lg hover:border-[#D4A017] hover:text-[#D4A017] transition-colors"
                >
                  Event Details
                </Link>
              </div>
            </div>
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
