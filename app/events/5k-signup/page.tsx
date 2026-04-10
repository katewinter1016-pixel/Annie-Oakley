'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, Users, Plus, Trash2, CalendarDays, MapPin } from 'lucide-react'

// ── Event configuration — update EVENT_START if time changes ─────
const EVENT_START = new Date('2026-06-20T09:00:00-06:00') // 9:00 AM MDT
const REGISTRATION_CUTOFF = new Date(EVENT_START.getTime() - 30 * 60 * 1000) // 30 min before
const SHIRT_CUTOFF = new Date('2026-05-29T23:59:59-06:00')

const ADULT_PRICE = 40
const YOUTH_PRICE = 30
const FREE_PRICE = 0

const SHIRT_SIZES = ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL', 'Adult 2XL', 'Adult 3XL']

const DISCLAIMER = `By registering for the Fetch the Finish Line 5K Run ("the Event"), I agree to the following terms:

Assumption of Risk: Participation in the Event involves physical activity and inherent risks including, but not limited to, personal injury, illness, death, or property damage. I voluntarily assume all such risks.

Release of Liability: Annie Oakley Animal Rescue, Winter Howlers (host), all sponsors, volunteers, and event staff are not responsible for any injuries, illness, medical events, or property damage occurring before, during, or after the Event.

Medical Clearance: I confirm I have consulted with or will consult with a physician before participating, particularly if I have existing medical conditions.

Participants Under 18: By registering a minor, I confirm I am the parent or legal guardian and agree to these terms on the minor's behalf.

Weather & Cancellation: The Event may be postponed or cancelled due to extreme weather or unforeseen circumstances. Registration fees are non-refundable and support Annie Oakley Animal Rescue directly.

Pets: Dogs are welcome on leash. I accept full responsibility for my pet at all times. All dogs must be current on vaccinations. Annie Oakley Animal Rescue is not responsible for any injuries or incidents involving pets.

Photography: I understand that photos and video may be taken at the Event and used for promotional purposes by Annie Oakley Animal Rescue and associated parties.

Conduct: I agree to follow all Event rules and the directions of staff and volunteers.

Annie Oakley Animal Rescue, its sponsors, and the host (Winter Howlers) are not responsible for any injuries, illness, or medical events at the Event. Please check with your doctor before participating.`

type AgeCategory = 'adult' | 'youth' | 'free'

type Participant = {
  id: string
  name: string
  ageCategory: AgeCategory
  shirtSize: string
}

function getPrice(cat: AgeCategory) {
  if (cat === 'adult') return ADULT_PRICE
  if (cat === 'youth') return YOUTH_PRICE
  return FREE_PRICE
}

function newParticipant(): Participant {
  return { id: Math.random().toString(36).slice(2), name: '', ageCategory: 'adult', shirtSize: '' }
}

export default function FiveKSignupPage() {
  const [formType, setFormType] = useState<'single' | 'family'>('single')
  const [shirtsOpen, setShirtsOpen] = useState(true)
  const [registrationOpen, setRegistrationOpen] = useState(true)

  useEffect(() => {
    const now = new Date()
    setShirtsOpen(now < SHIRT_CUTOFF)
    setRegistrationOpen(now < REGISTRATION_CUTOFF)
  }, [])

  if (!registrationOpen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image src="/fetch-5k.png" alt="Fetch the Finish Line 5K" fill className="object-contain" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#2D1606] mb-3">Registration Closed</h1>
          <p className="text-stone-500">
            Registration for the Fetch the Finish Line 5K closed 30 minutes before the event.
            We hope to see you at future events!
          </p>
          <Link href="/events" className="mt-6 inline-block text-[#D4A017] font-semibold hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[#2D1606] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <Image src="/fetch-5k.png" alt="Fetch the Finish Line 5K" fill className="object-contain" />
          </div>
          <div>
            <p className="text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-1">Register Now</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Fetch the Finish Line 5K
            </h1>
            <p className="text-amber-100/70 mt-1">Hosted by Winter Howlers · Annie Oakley Animal Rescue Fundraiser</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-amber-100/60">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-[#D4A017]" /> June 20, 2026</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#D4A017]" /> Eastern Montana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing info bar */}
      <div className="bg-amber-50 border-b border-amber-100 py-3 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 justify-center text-sm font-semibold text-stone-600">
          <span>Adult (18+) — <span className="text-[#2D1606]">$40</span></span>
          <span>Youth (6–17) — <span className="text-[#2D1606]">$30</span></span>
          <span>5 &amp; Under — <span className="text-green-600">Free</span></span>
          {!shirtsOpen && (
            <span className="text-stone-400 font-normal">T-shirt ordering closed May 29</span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Form type toggle */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setFormType('single')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-colors ${
              formType === 'single'
                ? 'bg-[#2D1606] text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            <User className="w-4 h-4" /> Individual
          </button>
          <button
            onClick={() => setFormType('family')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-colors ${
              formType === 'family'
                ? 'bg-[#2D1606] text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            <Users className="w-4 h-4" /> Family / Group
          </button>
        </div>

        {formType === 'single' ? (
          <SingleForm shirtsOpen={shirtsOpen} />
        ) : (
          <FamilyForm shirtsOpen={shirtsOpen} />
        )}
      </div>
    </div>
  )
}

// ── Single Form ────────────────────────────────────────────────────
function SingleForm({ shirtsOpen }: { shirtsOpen: boolean }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('adult')
  const [shirtSize, setShirtSize] = useState('')
  const [agreed, setAgreed] = useState(false)

  const price = getPrice(ageCategory)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!agreed) { setError('Please read and agree to the disclaimer.'); return }
    setSubmitting(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/events/5k-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registration_type: 'single',
        contact_name: fd.get('name') as string,
        contact_email: fd.get('email') as string,
        contact_phone: fd.get('phone') as string,
        participants: [{ name: fd.get('name') as string, age_category: ageCategory, shirt_size: shirtsOpen ? shirtSize : '', price }],
        total_cost: price,
      }),
    })

    const data = await res.json()
    if (!res.ok) setError(data.error || 'Something went wrong.')
    else { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    setSubmitting(false)
  }

  if (submitted) return <SuccessCard />

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
        <h2 className="font-display text-xl font-bold text-[#2D1606]">Your Information</h2>
        <InputField label="Full Name" name="name" required />
        <InputField label="Email" name="email" type="email" required />
        <InputField label="Phone Number" name="phone" type="tel" placeholder="(000) 000-0000" />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-stone-700">Age Category <span className="text-[#D4A017]">*</span></label>
          <div className="flex flex-col gap-2">
            {(['adult', 'youth', 'free'] as AgeCategory[]).map((cat) => (
              <label key={cat} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 cursor-pointer hover:border-[#D4A017] transition-colors">
                <span className="flex items-center gap-2">
                  <input type="radio" name="age_category" value={cat} checked={ageCategory === cat} onChange={() => setAgeCategory(cat)} className="accent-[#D4A017]" />
                  <span className="text-sm font-medium text-stone-700">
                    {cat === 'adult' ? 'Adult (18+)' : cat === 'youth' ? 'Youth (6–17)' : '5 & Under'}
                  </span>
                </span>
                <span className="text-sm font-bold text-[#2D1606]">
                  {cat === 'free' ? 'Free' : `$${getPrice(cat)}`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {shirtsOpen ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-700">T-Shirt Size <span className="text-stone-400 font-normal">(optional — order by May 29)</span></label>
            <select value={shirtSize} onChange={(e) => setShirtSize(e.target.value)} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] text-sm">
              <option value="">No shirt</option>
              {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ) : (
          <p className="text-stone-400 text-sm bg-stone-50 rounded-xl px-4 py-3">T-shirt ordering closed on May 29. You can still register to participate!</p>
        )}
      </div>

      <CostSummary participants={[{ name: '', age_category: ageCategory, shirt_size: shirtSize, price }]} />
      <PaymentInfo total={price} />
      <DisclaimerBox agreed={agreed} setAgreed={setAgreed} />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={submitting || !agreed} className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20">
        {submitting ? 'Registering…' : 'Complete Registration'}
      </button>
    </form>
  )
}

// ── Family Form ────────────────────────────────────────────────────
function FamilyForm({ shirtsOpen }: { shirtsOpen: boolean }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([newParticipant(), newParticipant()])

  const total = participants.reduce((sum, p) => sum + getPrice(p.ageCategory), 0)

  function updateParticipant(id: string, field: keyof Participant, value: string) {
    setParticipants((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p))
  }

  function removeParticipant(id: string) {
    if (participants.length <= 1) return
    setParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!agreed) { setError('Please read and agree to the disclaimer.'); return }
    const fd = new FormData(e.currentTarget)

    const hasEmptyName = participants.some((p) => !p.name.trim())
    if (hasEmptyName) { setError('Please enter a name for every participant.'); return }

    setSubmitting(true)
    setError('')

    const res = await fetch('/api/events/5k-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registration_type: 'family',
        contact_name: fd.get('contact_name') as string,
        contact_email: fd.get('contact_email') as string,
        contact_phone: fd.get('contact_phone') as string,
        participants: participants.map((p) => ({
          name: p.name,
          age_category: p.ageCategory,
          shirt_size: shirtsOpen ? p.shirtSize : '',
          price: getPrice(p.ageCategory),
        })),
        total_cost: total,
      }),
    })

    const data = await res.json()
    if (!res.ok) setError(data.error || 'Something went wrong.')
    else { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    setSubmitting(false)
  }

  if (submitted) return <SuccessCard />

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Contact info */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
        <h2 className="font-display text-xl font-bold text-[#2D1606]">Primary Contact</h2>
        <InputField label="Full Name" name="contact_name" required />
        <InputField label="Email" name="contact_email" type="email" required />
        <InputField label="Phone Number" name="contact_phone" type="tel" placeholder="(000) 000-0000" />
      </div>

      {/* Participants */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#2D1606]">Participants</h2>
          <button
            type="button"
            onClick={() => setParticipants((prev) => [...prev, newParticipant()])}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#D4A017] hover:text-yellow-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Person
          </button>
        </div>

        {participants.map((p, i) => (
          <div key={p.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-stone-400">Person {i + 1}</span>
              {participants.length > 1 && (
                <button type="button" onClick={() => removeParticipant(p.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Full Name *"
              value={p.name}
              onChange={(e) => updateParticipant(p.id, 'name', e.target.value)}
              required
              className="w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A017] text-sm"
            />

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Age Category</label>
              <div className="flex flex-wrap gap-2">
                {(['adult', 'youth', 'free'] as AgeCategory[]).map((cat) => (
                  <label key={cat} className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-colors ${p.ageCategory === cat ? 'bg-[#2D1606] text-white border-[#2D1606]' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                    <input type="radio" name={`age_${p.id}`} value={cat} checked={p.ageCategory === cat} onChange={() => updateParticipant(p.id, 'ageCategory', cat)} className="sr-only" />
                    {cat === 'adult' ? `Adult — $${ADULT_PRICE}` : cat === 'youth' ? `Youth — $${YOUTH_PRICE}` : '5 & Under — Free'}
                  </label>
                ))}
              </div>
            </div>

            {shirtsOpen && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">T-Shirt Size <span className="font-normal normal-case text-stone-400">(optional)</span></label>
                <select value={p.shirtSize} onChange={(e) => updateParticipant(p.id, 'shirtSize', e.target.value)} className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A017] text-sm">
                  <option value="">No shirt</option>
                  {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
        ))}

        {!shirtsOpen && (
          <p className="text-stone-400 text-sm bg-stone-50 rounded-xl px-4 py-3">T-shirt ordering closed on May 29. You can still register to participate!</p>
        )}
      </div>

      <CostSummary
        participants={participants.map((p) => ({ name: p.name, age_category: p.ageCategory, shirt_size: p.shirtSize, price: getPrice(p.ageCategory) }))}
      />
      <PaymentInfo total={total} />
      <DisclaimerBox agreed={agreed} setAgreed={setAgreed} />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={submitting || !agreed} className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20">
        {submitting ? 'Registering…' : `Complete Registration · $${total}`}
      </button>
    </form>
  )
}

// ── Shared sub-components ──────────────────────────────────────────

function CostSummary({ participants }: { participants: Array<{ name: string; age_category: string; shirt_size: string; price: number }> }) {
  const total = participants.reduce((sum, p) => sum + p.price, 0)
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
      <h3 className="font-display text-lg font-bold text-[#2D1606] mb-4">Cost Summary</h3>
      <div className="flex flex-col gap-2 text-sm">
        {participants.map((p, i) => (
          <div key={i} className="flex justify-between text-stone-600">
            <span>{p.name || `Person ${i + 1}`} <span className="text-stone-400 capitalize">({p.age_category === 'free' ? '5 & under' : p.age_category})</span></span>
            <span className="font-semibold text-stone-700">{p.price === 0 ? 'Free' : `$${p.price}`}</span>
          </div>
        ))}
        <div className="border-t border-stone-100 pt-3 mt-1 flex justify-between font-bold text-[#2D1606]">
          <span>Total</span>
          <span className="text-[#D4A017] text-lg">${total}</span>
        </div>
      </div>
    </div>
  )
}

function PaymentInfo({ total }: { total: number }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col gap-2">
      <h3 className="font-bold text-[#2D1606]">Payment</h3>
      <p className="text-stone-600 text-sm leading-relaxed">
        After submitting, please pay <strong className="text-[#2D1606]">${total}</strong> via Venmo to{' '}
        <a href="https://venmo.com/CareMt24" target="_blank" rel="noopener noreferrer" className="text-[#D4A017] font-bold hover:underline">@CareMt24</a>{' '}
        with the note <strong>"5K – [your name]"</strong>. Your registration is confirmed once payment is received.
      </p>
    </div>
  )
}

function DisclaimerBox({ agreed, setAgreed }: { agreed: boolean; setAgreed: (v: boolean) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-4">
      <h3 className="font-bold text-[#2D1606]">Disclaimer & Waiver <span className="text-[#D4A017]">*</span></h3>
      <div className="bg-stone-50 rounded-xl p-4 max-h-48 overflow-y-auto">
        <p className="text-xs text-stone-500 leading-relaxed whitespace-pre-line">{DISCLAIMER}</p>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="accent-[#D4A017] w-4 h-4 mt-0.5 flex-shrink-0"
        />
        <span className="text-sm text-stone-700 font-medium">
          I have read, understand, and agree to the disclaimer and waiver above. If registering on behalf of minors, I confirm I am their parent or legal guardian.
        </span>
      </label>
    </div>
  )
}

function SuccessCard() {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-10 text-center flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <Image src="/fetch-5k.png" alt="5K" fill className="object-contain" />
      </div>
      <h3 className="font-display text-2xl font-bold text-[#2D1606]">You're Registered!</h3>
      <p className="text-stone-500 max-w-sm">
        Check your email for confirmation details. Don't forget to complete your Venmo payment to <strong>@CareMt24</strong> with the note "5K – [your name]" to finalize your spot.
      </p>
      <Link href="/events" className="mt-2 text-[#D4A017] font-semibold hover:underline">
        ← Back to Events
      </Link>
    </div>
  )
}

function InputField({ label, name, type = 'text', required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-stone-700">
        {label} {required && <span className="text-[#D4A017]">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent placeholder:text-stone-300 text-sm"
      />
    </div>
  )
}
