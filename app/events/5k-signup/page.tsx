'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, CheckCircle2, Camera, Heart } from 'lucide-react'

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

const WAIVER_TEXT = `I, the undersigned, do hereby release and hold harmless Annie Oakley Animal Rescue, Winter Howlers, and all event organizers (collectively "Released Parties") from any and all claims, demands, causes of action, costs, or expenses of any nature arising out of my participation in the Fetch the Finish Line Virtual Fun Run beginning June 1, 2026.

I acknowledge that participating in a running or walking event involves physical activity and associated risks, including but not limited to bodily injury, property damage, or death. I voluntarily assume all such risks and acknowledge that I am solely responsible for choosing a safe route and location for my virtual run or walk.

I certify that I am physically fit to participate in this event and have not been advised otherwise by a qualified medical professional. I grant permission for emergency medical treatment in the event I am unable to communicate.

I am at least 18 years of age, or if registering on behalf of a minor, I am the parent or legal guardian and hereby grant permission for the minor to participate and accept these terms on their behalf.

By checking the box below, I acknowledge that I have read and fully understand this release of liability and voluntarily agree to its terms.`

export default function FiveKSignupPage() {
  const [participantName, setParticipantName] = useState('')
  const [wantsShirt, setWantsShirt] = useState(true)
  const [shirtSize, setShirtSize] = useState('')
  const [donationAmount, setDonationAmount] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [mailingStreet, setMailingStreet] = useState('')
  const [mailingCity, setMailingCity] = useState('')
  const [mailingState, setMailingState] = useState('')
  const [mailingZip, setMailingZip] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const [submittedTotal, setSubmittedTotal] = useState(0)
  const [error, setError] = useState('')

  const shirtCost = wantsShirt ? 40 : 0
  const extraDonation = parseFloat(donationAmount) || 0
  const totalCost = shirtCost + extraDonation

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!participantName.trim() || !contactEmail.trim()) {
      setError('Name and email are required.')
      return
    }
    if (wantsShirt && !shirtSize) {
      setError('Please select a shirt size.')
      return
    }
    if (wantsShirt && (!mailingStreet.trim() || !mailingCity.trim() || !mailingState.trim() || !mailingZip.trim())) {
      setError('A mailing address is required for T-shirt delivery.')
      return
    }
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      setError('Emergency contact name and phone are required.')
      return
    }
    if (!waiverAccepted) {
      setError('You must accept the liability waiver to register.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/events/5k-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_type: 'individual',
          contact_name: participantName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          mailing_address: wantsShirt
            ? { street: mailingStreet, city: mailingCity, state: mailingState, zip: mailingZip }
            : null,
          emergency_contact: { name: emergencyName, phone: emergencyPhone, relation: emergencyRelation },
          participants: [{
            name: participantName,
            age_category: 'adult',
            shirt_size: wantsShirt ? shirtSize : '',
            price: shirtCost,
          }],
          total_cost: totalCost,
          wants_shirt: wantsShirt,
          donation_amount: extraDonation,
          animals: [],
          liability_accepted: true,
          volunteer_role: null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        setSubmitting(false)
        return
      }
      setSubmittedName(participantName)
      setSubmittedTotal(totalCost)
      setSubmitted(true)
      if (totalCost > 0) {
        setTimeout(() => { window.location.href = 'https://venmo.com/CareMt24' }, 3000)
      }
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-green-500" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-[#2D1606]">{"You're Registered!"}</h1>
            <p className="text-stone-500 mt-2 leading-relaxed">
              Thank you for signing up for the <strong>Fetch the Finish Line Virtual Fun Run</strong>! Check your inbox for a confirmation email.
            </p>
          </div>

          {totalCost > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 w-full text-sm text-stone-700 text-left">
              <p className="font-bold text-[#2D1606] mb-2">Complete your payment:</p>
              <p>Send <strong className="text-[#D4A017]">${submittedTotal % 1 === 0 ? submittedTotal : submittedTotal.toFixed(2)}</strong> via Venmo to <strong>@CareMt24</strong></p>
              <p className="text-stone-500 text-xs mt-1.5">
                Note: <strong>&ldquo;{submittedName} Fetch&rdquo;</strong>
              </p>
              <p className="text-stone-400 text-xs mt-1">Your registration is not confirmed until payment is received.</p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 w-full text-sm text-stone-700 text-center">
              <p className="text-stone-500">Donations of any size are always welcome via Venmo <strong>@CareMt24</strong> — thank you for participating!</p>
            </div>
          )}

          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 w-full text-sm text-stone-600 flex flex-col gap-1.5">
            <p className="flex items-center gap-2 font-semibold text-[#2D1606]">
              <Camera className="w-4 h-4 text-[#D4A017]" /> Don&apos;t forget the photo challenge!
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Take a photo of your run or walk and tag <strong>@WinterHowlers</strong> and <strong>@AnnieOakleyAnimalRescue</strong> to show your support!
            </p>
          </div>

          {submittedTotal > 0 && (
            <p className="text-stone-400 text-xs text-center">
              Redirecting you to Annie Oakley Animal Rescue&apos;s Venmo in a moment…
            </p>
          )}
          <Link href="/" className="text-[#D4A017] font-semibold hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[#2D1606] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <Image src="/fetch-5k.png" alt="Fetch the Finish Line Virtual Fun Run" fill className="object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-1">
              Annie Oakley Animal Rescue Fundraiser
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Fetch the Finish Line Virtual Fun Run
            </h1>
            <p className="text-amber-100/70 mt-1">Hosted by Winter Howlers</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-amber-100/60">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#D4A017]" /> Starting June 1, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#D4A017]" /> Virtual — Run from anywhere!
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* ── T-shirt Disclaimer ────────────────────────────────── */}
          <div className="bg-[#D4A017]/10 border border-[#D4A017]/40 rounded-2xl px-6 py-4 flex flex-col gap-1">
            <p className="text-xs font-bold text-[#2D1606] uppercase tracking-wide">T-Shirt Deadline</p>
            <p className="text-sm text-stone-700 leading-relaxed">
              T-shirts ordered before <strong>June 3rd</strong> will be mailed in time for the run.
              Orders placed after this date may not arrive in time.
            </p>
          </div>

          {/* ── Your Info ─────────────────────────────────────────── */}
          <FormSection title="Your Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Full Name *</label>
                <input
                  type="text"
                  value={participantName}
                  onChange={e => setParticipantName(e.target.value)}
                  placeholder="First & Last Name"
                  required
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="(406) 555-0000"
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                />
              </div>
            </div>
          </FormSection>

          {/* ── T-shirt / Donation ────────────────────────────────── */}
          <FormSection title="Participation Option" subtitle="Choose a T-shirt registration or participate free — all donations welcome.">
            <div className="flex flex-col gap-4">

              {/* T-shirt toggle */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setWantsShirt(true)}
                  className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all text-center ${
                    wantsShirt ? 'border-[#D4A017] bg-amber-50' : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <p className={`font-bold text-sm ${wantsShirt ? 'text-[#2D1606]' : 'text-stone-600'}`}>T-shirt Registration</p>
                  <p className={`text-2xl font-display font-bold ${wantsShirt ? 'text-[#D4A017]' : 'text-stone-400'}`}>$40</p>
                  <p className="text-stone-400 text-xs">Includes event T-shirt mailed to you</p>
                </button>
                <button
                  type="button"
                  onClick={() => setWantsShirt(false)}
                  className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all text-center ${
                    !wantsShirt ? 'border-[#D4A017] bg-amber-50' : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <p className={`font-bold text-sm ${!wantsShirt ? 'text-[#2D1606]' : 'text-stone-600'}`}>Participate Free</p>
                  <p className={`text-2xl font-display font-bold ${!wantsShirt ? 'text-[#D4A017]' : 'text-stone-400'}`}>$0</p>
                  <p className="text-stone-400 text-xs">All donations welcome</p>
                </button>
              </div>

              {/* Shirt size (if T-shirt selected) */}
              {wantsShirt && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">T-Shirt Size *</label>
                  <div className="flex flex-wrap gap-2">
                    {SHIRT_SIZES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setShirtSize(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                          shirtSize === s
                            ? 'border-[#D4A017] bg-amber-50 text-[#2D1606]'
                            : 'border-stone-200 text-stone-500 hover:border-amber-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional extra donation */}
              <div className="flex flex-col gap-1.5 border-t border-stone-100 pt-4">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Additional Donation (optional)
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={donationAmount}
                    onChange={e => setDonationAmount(e.target.value)}
                    placeholder="0"
                    className="border border-stone-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017] w-full"
                  />
                </div>
                <p className="text-xs text-stone-400">Every dollar goes directly to the animals in our care.</p>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t border-stone-200 pt-4">
                <span className="font-semibold text-stone-600">Total</span>
                <span className="font-bold text-[#2D1606] text-xl">
                  {totalCost === 0 ? 'Free' : `$${totalCost % 1 === 0 ? totalCost : totalCost.toFixed(2)}`}
                </span>
              </div>
            </div>
          </FormSection>

          {/* ── Mailing Address (T-shirt only) ────────────────────── */}
          {wantsShirt && (
            <FormSection title="Mailing Address" subtitle="Required for T-shirt delivery. All purchases are final.">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Street Address *</label>
                  <input
                    type="text"
                    value={mailingStreet}
                    onChange={e => setMailingStreet(e.target.value)}
                    placeholder="123 Main St"
                    required
                    className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">City</label>
                    <input type="text" value={mailingCity} onChange={e => setMailingCity(e.target.value)} placeholder="Fairview"
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">State</label>
                    <input type="text" value={mailingState} onChange={e => setMailingState(e.target.value)} placeholder="MT" maxLength={2}
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017] uppercase" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">ZIP</label>
                    <input type="text" value={mailingZip} onChange={e => setMailingZip(e.target.value)} placeholder="59221" maxLength={10}
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" />
                  </div>
                </div>
              </div>
            </FormSection>
          )}

          {/* ── Emergency Contact ─────────────────────────────────── */}
          <FormSection title="Emergency Contact" subtitle="Someone we can reach if needed.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Full Name *</label>
                <input type="text" value={emergencyName} onChange={e => setEmergencyName(e.target.value)}
                  placeholder="Emergency contact name" required
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Phone *</label>
                <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)}
                  placeholder="(406) 555-0000" required
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Relationship</label>
                <input type="text" value={emergencyRelation} onChange={e => setEmergencyRelation(e.target.value)}
                  placeholder="e.g. Spouse, Parent, Friend"
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" />
              </div>
            </div>
          </FormSection>

          {/* ── Photo Challenge ───────────────────────────────────── */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl px-6 py-5 flex gap-4 items-start">
            <Camera className="w-6 h-6 text-[#D4A017] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2D1606] text-sm mb-1">Photo Challenge</p>
              <p className="text-sm text-stone-600 leading-relaxed">
                After your run or walk, take a photo and tag{' '}
                <strong>@WinterHowlers</strong> and{' '}
                <strong>@AnnieOakleyAnimalRescue</strong> to show your support and spread the word!
              </p>
            </div>
          </div>

          {/* ── Liability Waiver ──────────────────────────────────── */}
          <FormSection title="Liability Waiver" subtitle="Please read and accept the waiver below to complete registration.">
            <div className="flex flex-col gap-4">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 max-h-64 overflow-y-auto">
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">{WAIVER_TEXT}</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={waiverAccepted} onChange={e => setWaiverAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#D4A017] flex-shrink-0" />
                <span className="text-sm text-stone-700 leading-relaxed">
                  I have read, understand, and agree to the terms of the liability waiver above. I am 18 or older,
                  or I am the parent/legal guardian of any minor participants listed and accept these terms on their behalf.
                </span>
              </label>
            </div>
          </FormSection>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">{error}</div>
          )}

          {/* Submit */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#D4A017] text-[#2D1606] px-12 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-[#D4A017]/30 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {submitting ? 'Submitting…' : totalCost === 0 ? 'Register — Free!' : `Register — $${totalCost % 1 === 0 ? totalCost : totalCost.toFixed(2)} via Venmo`}
            </button>
            {totalCost > 0 && (
              <div className="text-center max-w-sm flex flex-col gap-2">
                <p className="text-stone-500 text-sm">
                  After submitting, this page will redirect you to{' '}
                  <strong>Annie Oakley Animal Rescue&apos;s Venmo (@CareMt24)</strong>.
                  In the note, put your name + <strong>&ldquo;Fetch&rdquo;</strong>.
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/events" className="text-[#D4A017] font-semibold hover:underline text-sm">
              ← Back to Events
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl font-bold text-[#2D1606]">{title}</h2>
        {subtitle && <p className="text-stone-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
