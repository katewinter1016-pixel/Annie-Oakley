import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import GoogleCalendarEmbed from './GoogleCalendarEmbed'

export const metadata: Metadata = {
  title: 'Events | Annie Oakley Animal Rescue',
  description: 'Upcoming fundraisers, adoption events, and community gatherings hosted by Annie Oakley Animal Rescue in Eastern Montana.',
}

// ── Upcoming events (add new events here) ────────────────────────
const UPCOMING_EVENTS = [
  {
    id: '5k-2026',
    title: 'Fetch the Finish Line 5K Run',
    subtitle: 'Hosted by Winter Howlers',
    date: 'June 20, 2026',
    time: 'TBD',
    location: 'Eastern Montana',
    description:
      'Lace up your shoes and bring your four-legged friends! Join us for the Fetch the Finish Line 5K — a fundraiser run benefiting Annie Oakley Animal Rescue. Every mile run supports animals in our care. Dogs welcome on leash!',
    image: '/fetch-5k.png',
    featured: true,
  },
]

export default function EventsPage() {
  const featured = UPCOMING_EVENTS.find((e) => e.featured)
  const others = UPCOMING_EVENTS.filter((e) => !e.featured)

  return (
    <div>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-amber-100 py-3 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-sm text-stone-500 hover:text-[#D4A017] transition-colors font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <div className="w-12 h-1 bg-[#D4A017] mx-auto mb-4 rounded-full" />
          <h1 className="font-display text-5xl font-bold text-[#2D1606]">Events</h1>
          <p className="text-stone-500 mt-3 text-lg max-w-xl mx-auto">
            Join us at our upcoming fundraisers and community events. Every event directly supports the animals in our rescue.
          </p>
        </div>

        {/* ── FEATURED EVENT ───────────────────────────────────── */}
        {featured && (
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold text-[#2D1606] mb-6">Featured Event</h2>
            <div className="bg-white rounded-3xl border border-amber-100 shadow-xl overflow-hidden flex flex-col lg:flex-row">
              {/* Image */}
              <div className="lg:w-96 flex-shrink-0 bg-amber-50 flex items-center justify-center p-10">
                <div className="relative w-72 h-72">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-3 py-1 rounded-full">
                    Upcoming Fundraiser
                  </span>
                  <h3 className="font-display text-4xl font-bold text-[#2D1606] mt-4 leading-tight">
                    {featured.title}
                  </h3>
                  <p className="text-stone-400 font-semibold mt-1">{featured.subtitle}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-stone-600">
                    <CalendarDays className="w-5 h-5 text-[#D4A017] flex-shrink-0" />
                    <span className="font-semibold">{featured.date}</span>
                  </div>
                  {featured.time !== 'TBD' && (
                    <div className="flex items-center gap-3 text-stone-600">
                      <Clock className="w-5 h-5 text-[#D4A017] flex-shrink-0" />
                      <span>{featured.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-stone-600">
                    <MapPin className="w-5 h-5 text-[#D4A017] flex-shrink-0" />
                    <span>{featured.location}</span>
                  </div>
                </div>

                <p className="text-stone-500 leading-relaxed">{featured.description}</p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/events/5k-signup"
                    className="bg-[#D4A017] text-[#2D1606] px-7 py-3.5 rounded-full font-bold hover:bg-yellow-400 transition-colors text-center shadow-lg shadow-[#D4A017]/20"
                  >
                    Sign Up for the 5K
                  </Link>
                  <Link
                    href="/volunteer"
                    className="border-2 border-[#2D1606] text-[#2D1606] px-7 py-3.5 rounded-full font-bold hover:bg-[#2D1606] hover:text-white transition-colors text-center"
                  >
                    Volunteer at the Event
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── OTHER EVENTS ─────────────────────────────────────── */}
        {others.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold text-[#2D1606] mb-6">More Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {others.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#2D1606]">{event.title}</h3>
                    <p className="text-stone-400 text-sm">{event.subtitle}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-stone-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#D4A017]" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D4A017]" />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── GOOGLE CALENDAR ──────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-1 bg-[#D4A017] rounded-full" />
            <h2 className="font-display text-2xl font-bold text-[#2D1606]">Full Event Calendar</h2>
          </div>
          <GoogleCalendarEmbed />
        </section>
      </div>
    </div>
  )
}
