import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import GoogleCalendarEmbed from './GoogleCalendarEmbed'

export const metadata: Metadata = {
  title: 'Events | Annie Oakley Animal Rescue',
  description: 'Upcoming fundraisers, adoption events, and community gatherings hosted by Annie Oakley Animal Rescue in Eastern Montana.',
}

export default function EventsPage() {
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

        {/* ── UPCOMING EVENT FLYERS ────────────────────────────── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-1 bg-[#D4A017] rounded-full" />
            <h2 className="font-display text-2xl font-bold text-[#2D1606]">Upcoming Events</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/tails-and-tinsel-2026.png"
                alt="Tails & Tinsel Gala — November 28, 2026"
                width={800}
                height={1200}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/fall-festival-2026.png"
                alt="Fall Festival 2026"
                width={800}
                height={1200}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>

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
