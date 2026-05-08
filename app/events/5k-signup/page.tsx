'use client'

import { useState, type ReactNode, type ElementType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Plus, Trash2, Users, User, CheckCircle2 } from 'lucide-react'

type AgeCategory = 'adult' | 'under5'

interface Participant {
  name: string
  age_category: AgeCategory
  shirt_size: string
  price: number
}

const PRICES: Record<AgeCategory, number> = { adult: 40, under5: 0 }
const AGE_LABELS: Record<AgeCategory, string> = {
  adult: 'Adult — $40',
  under5: '5 & Under — Free',
}
const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

const WAIVER_TEXT = `I, the undersigned, do hereby release and hold harmless Annie Oakley Animal Rescue, Winter Howlers, the City of Fairview, and all event volunteers, sponsors, and organizers (collectively "Released Parties") from any and all claims, demands, causes of action, costs, or expenses of any nature arising out of my participation in the Fetch the Finish Line Fun Run event on June 20, 2026 at Sharbono Park in Fairview, Montana.

I acknowledge that participating in a fun run event involves physical activity and associated risks, including but not limited to bodily injury, property damage, or death. I voluntarily assume all such risks.

I certify that I am physically fit to participate in this event and have not been advised otherwise by a qualified medical professional. I grant permission for emergency medical treatment in the event I am unable to communicate.

I am at least 18 years of age, or if registering on behalf of a minor, I am the parent or legal guardian and hereby grant permission for the minor to participate and accept these terms on their behalf.

By checking the box below, I acknowledge that I have read and fully understand this release of liability and voluntarily agree to its terms.`

export default function FiveKSignupPage() {
  const [regType, setRegType] = useState<'individual' | 'group'>('individual')
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', age_category: 'adult', shirt_size: '', price: 40 },
  ])
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [mailingStreet, setMailingStreet] = useState('')
  const [mailingCity, setMailingCity] = useState('')
  const [mailingState, setMailingState] = useState('')
  const [mailingZip, setMailingZip] = useState('')
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const [submittedTotal, setSubmittedTotal] = useState(0)
  const [error, setError] = useState('')

  const totalCost = participants.reduce((sum, p) => sum + p.price, 0)

  function updateParticipant(i: number, updates: Partial<Participant>) {
    setParticipants(prev =>
      prev.map((p, idx) => {
        if (idx !== i) return p
        const next = { ...p, ...updates }
        if (updates.age_category) next.price = PRICES[updates.age_category]
        return next
      })
    )
  }

  function addParticipant() {
    setParticipants(prev => [...prev, { name: '', age_category: 'adult', shirt_size: '', price: 40 }])
  }

  function removeParticipant(i: number) {
    if (participants.length <= 1) return
    setParticipants(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!waiverAccepted) {
      setError('You must accept the liability waiver to register.')
      return
    }
    if (participants.some(p => !p.name.trim())) {
      setError('Please enter a name for each participant.')
      return
    }
    if (!contactName.trim() || !contactEmail.trim()) {
      setError('Contact name and email are required.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/events/5k-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_type: regType,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          mailing_address: mailingStreet
            ? { street: mailingStreet, city: mailingCity, state: mailingState, zip: mailingZip }
            : null,
          participants,
          total_cost: totalCost,
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
      setSubmittedName(contactName)
      setSubmittedTotal(totalCost)
      setSubmitted(true)
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
              Thank you for signing up for the <strong>Fetch the Finish Line Fun Run</strong>! Check your inbox for a confirmation email.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 w-full text-sm text-stone-700 text-left">
            <p className="font-bold text-[#2D1606] mb-2">Complete your payment:</p>
            <p>Send <strong className="text-[#D4A017]">${submittedTotal}</strong> via Venmo to <strong>@CareMt24</strong></p>
            <p className="text-stone-400 text-xs mt-1.5">Note: &ldquo;Fun Run – {submittedName}&rdquo;</p>
            <p className="text-stone-400 text-xs mt-1">Your registration is not confirmed until payment is received.</p>
          </div>
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
            <Image src="/fetch-5k.png" alt="Fetch the Finish Line Fun Run" fill className="object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-1">
              Annie Oakley Animal Rescue Fundraiser
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Fetch the Finish Line Fun Run
            </h1>
            <p className="text-amber-100/70 mt-1">Hosted by Winter Howlers</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-amber-100/60">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#D4A017]" /> June 20, 2026 · 7:00 AM
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D4A017]" /> Fairview, MT · Sharbono Park
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div className="bg-white rounded-2xl p-2 shadow-lg">
              <div className="relative w-24 h-20">
                <Image src="/hoopfest-logo.png" alt="Hoopfest Border Town" fill className="object-contain" />
              </div>
            </div>
            <p className="text-amber-100/50 text-xs font-semibold uppercase tracking-wide">Part of Hoopfest</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* ── Registration Type ─────────────────────────────────── */}
          <FormSection title="Registration Type">
            <div className="flex gap-4">
              <TypeCard
                label="Individual"
                desc="Register yourself or one person."
                Icon={User}
                selected={regType === 'individual'}
                onClick={() => {
                  setRegType('individual')
                  setParticipants([{ name: '', age_category: 'adult', shirt_size: '', price: 40 }])
                }}
              />
              <TypeCard
                label="Group"
                desc="Register a family, friends, or a team together."
                Icon={Users}
                selected={regType === 'group'}
                onClick={() => setRegType('group')}
              />
            </div>
          </FormSection>

          {/* ── Participants ──────────────────────────────────────── */}
          <FormSection
            title="Participants"
            subtitle="Add each person joining the run or walk. T-shirts available for adults."
          >
            <div className="flex flex-col gap-4">
              {participants.map((p, i) => (
                <div key={i} className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-700 text-sm">Participant {i + 1}</span>
                    {participants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(i)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={e => updateParticipant(i, { name: e.target.value })}
                        placeholder="First & Last Name"
                        className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017] transition-colors"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        Category *
                      </label>
                      <select
                        value={p.age_category}
                        onChange={e => updateParticipant(i, { age_category: e.target.value as AgeCategory })}
                        className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017] transition-colors bg-white"
                      >
                        {(Object.entries(AGE_LABELS) as [AgeCategory, string][]).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                    {p.age_category !== 'under5' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                          T-Shirt Size
                        </label>
                        <select
                          value={p.shirt_size}
                          onChange={e => updateParticipant(i, { shirt_size: e.target.value })}
                          className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017] transition-colors bg-white"
                        >
                          <option value="">— No shirt —</option>
                          {SHIRT_SIZES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="flex items-end pb-0.5">
                      <span className="font-bold text-[#D4A017] text-lg">
                        {p.price === 0 ? 'Free' : `$${p.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addParticipant}
                className="flex items-center gap-2 text-[#D4A017] font-semibold text-sm hover:text-yellow-600 transition-colors self-start"
              >
                <Plus className="w-4 h-4" /> Add Another Participant
              </button>

              <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
                <span className="font-semibold text-stone-600">Registration Total</span>
                <span className="font-bold text-[#2D1606] text-xl">${totalCost}</span>
              </div>
              <p className="text-stone-400 text-xs -mt-2">
                Payment via Venmo (@CareMt24) after registration. Not confirmed until payment received.
              </p>
            </div>
          </FormSection>

          {/* ── Contact Info ──────────────────────────────────────── */}
          <FormSection title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="Your name"
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                  required
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

              {/* Mailing Address */}
              <div className="sm:col-span-2 border-t border-stone-100 pt-4 flex flex-col gap-3">
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Mailing Address</p>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Optional — for event communications only. Once your order is placed, a mailing address cannot be added or changed. All purchases are final.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Street Address</label>
                  <input
                    type="text"
                    value={mailingStreet}
                    onChange={e => setMailingStreet(e.target.value)}
                    placeholder="123 Main St"
                    className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">City</label>
                    <input
                      type="text"
                      value={mailingCity}
                      onChange={e => setMailingCity(e.target.value)}
                      placeholder="Fairview"
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">State</label>
                    <input
                      type="text"
                      value={mailingState}
                      onChange={e => setMailingState(e.target.value)}
                      placeholder="MT"
                      maxLength={2}
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017] uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">ZIP</label>
                    <input
                      type="text"
                      value={mailingZip}
                      onChange={e => setMailingZip(e.target.value)}
                      placeholder="59221"
                      maxLength={10}
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── Liability Waiver ──────────────────────────────────── */}
          <FormSection
            title="Liability Waiver"
            subtitle="Please read and accept the waiver below to complete registration."
          >
            <div className="flex flex-col gap-4">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 max-h-64 overflow-y-auto">
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">{WAIVER_TEXT}</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waiverAccepted}
                  onChange={e => setWaiverAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#D4A017] flex-shrink-0"
                />
                <span className="text-sm text-stone-700 leading-relaxed">
                  I have read, understand, and agree to the terms of the liability waiver above. I am 18 or older,
                  or I am the parent/legal guardian of any minor participants listed and accept these terms on their behalf.
                </span>
              </label>
            </div>
          </FormSection>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#D4A017] text-[#2D1606] px-12 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-[#D4A017]/30 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {submitting
                ? 'Submitting…'
                : totalCost === 0
                ? 'Register — Free!'
                : `Register — $${totalCost} due via Venmo`}
            </button>
            <p className="text-stone-400 text-xs text-center max-w-sm">
              After registering, send payment via Venmo to <strong>@CareMt24</strong> with note{' '}
              <em>&ldquo;Fun Run – [your name]&rdquo;</em> to confirm your spot.
            </p>
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

// ── Helper components ─────────────────────────────────────────────

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
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

function TypeCard({
  label,
  desc,
  Icon,
  selected,
  onClick,
}: {
  label: string
  desc: string
  Icon: ElementType
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center ${
        selected ? 'border-[#D4A017] bg-amber-50' : 'border-stone-200 hover:border-amber-300 bg-white'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          selected ? 'bg-[#D4A017]/20' : 'bg-stone-100'
        }`}
      >
        <Icon className={`w-5 h-5 ${selected ? 'text-[#D4A017]' : 'text-stone-400'}`} />
      </div>
      <div>
        <p className={`font-bold text-sm ${selected ? 'text-[#2D1606]' : 'text-stone-600'}`}>{label}</p>
        <p className="text-stone-400 text-xs mt-0.5">{desc}</p>
      </div>
    </button>
  )
}
