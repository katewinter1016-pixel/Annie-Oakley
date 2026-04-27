import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fetch the Finish Line 5K | Annie Oakley Animal Rescue',
  description: 'Join us for the Fetch the Finish Line 5K Run benefiting Annie Oakley Animal Rescue. Held in Fairview, MT at Sharbono Park.',
}

export default function FiveKInfoPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-[#2D1606] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <Image src="/fetch-5k.png" alt="Fetch the Finish Line 5K" fill className="object-contain" />
          </div>
          <div>
            <p className="text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-1">Annie Oakley Animal Rescue Fundraiser</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Fetch the Finish Line 5K
            </h1>
            <p className="text-amber-100/70 mt-1">Hosted by Winter Howlers</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-amber-100/60">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#D4A017]" /> Date coming soon
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D4A017]" /> Fairview, MT · Sharbono Park
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">

        {/* More details coming soon */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="font-display text-xl font-bold text-[#2D1606] mb-1">More Details Coming Soon</p>
          <p className="text-stone-500 text-sm">Stay tuned — registration info, start time, and full event details will be posted here shortly.</p>
        </div>

        {/* Entry fees */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-display text-xl font-bold text-[#2D1606] mb-4">Entry Fees</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <span className="text-stone-700 font-medium">Adult (18+)</span>
              <span className="font-bold text-[#2D1606] text-lg">$40</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <span className="text-stone-700 font-medium">Youth (6–17)</span>
              <span className="font-bold text-[#2D1606] text-lg">$30</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-stone-700 font-medium">5 &amp; Under</span>
              <span className="font-bold text-green-600 text-lg">Free</span>
            </div>
          </div>
          <p className="text-stone-400 text-sm mt-4">T-shirts will be available. Every entry goes directly toward our dream facility fund.</p>
        </div>

        {/* Volunteer at a booth */}
        <div className="bg-[#2D1606] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-display text-xl font-bold text-[#D4A017]">Want to Volunteer?</p>
            <p className="text-amber-100/70 text-sm mt-1">Sign up to work a booth at the event. Check the Volunteer tab to get involved!</p>
          </div>
          <Link
            href="/volunteer"
            className="bg-[#D4A017] text-[#2D1606] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors whitespace-nowrap flex-shrink-0"
          >
            Volunteer Sign-Up →
          </Link>
        </div>

        {/* Sponsor info */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-display text-xl font-bold text-[#2D1606] mb-2">Become a Sponsor</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-4">
            Interested in sponsoring the Fetch the Finish Line 5K? We'd love to have you involved. Please reach out directly to get more information.
          </p>
          <a
            href="mailto:winterhowlers@gmail.com?subject=5k%20sponsor"
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-[#2D1606] font-semibold hover:border-[#D4A017] transition-colors w-fit"
          >
            <Mail className="w-4 h-4 text-[#D4A017]" />
            Contact Kate Winter — winterhowlers@gmail.com
          </a>
          <p className="text-stone-400 text-xs mt-2">Use subject line: <strong>5k sponsor</strong></p>
        </div>

        <div className="text-center">
          <Link href="/events" className="text-[#D4A017] font-semibold hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    </div>
  )
}
