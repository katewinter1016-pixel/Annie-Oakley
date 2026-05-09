'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, Truck, Camera, DollarSign, CalendarDays, MoreHorizontal, CheckCircle2 } from 'lucide-react'

const VOLUNTEER_ROLES = [
  { icon: Heart, label: 'Animal Care', desc: 'Feeding, socializing, and caring for animals in foster or at events.' },
  { icon: Truck, label: 'Transport', desc: 'Driving animals to vet appointments or between foster homes.' },
  { icon: Camera, label: 'Photography / Social Media', desc: 'Taking photos and helping promote animals online.' },
  { icon: CalendarDays, label: 'Events', desc: 'Helping organize and run adoption events and fundraisers.' },
  { icon: DollarSign, label: 'Fundraising', desc: 'Helping us raise funds to care for animals and build our facility.' },
  { icon: MoreHorizontal, label: 'Other', desc: 'Have a skill that could help? We want to hear from you.' },
]

const STAFF_ROLES = [
  { id: 'sign-in-booth', label: 'Sign-In Booth Volunteer', desc: 'Check in runners at the start line.' },
  { id: 'post-run-booth', label: 'Post Run Booth Volunteer', desc: 'Greet finishers and help with the post-race celebration.' },
  { id: 'race-setup', label: 'Race Set-Up Volunteer', desc: 'Help set up the course, signs, and staging before the race.' },
  { id: 'alternate-volunteer', label: 'Alternate Volunteer', desc: 'Available to fill in wherever help is needed on race day.' },
]

type SlotData = Record<string, { taken: number; remaining: number; max: number }>

export default function VolunteerPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [ftfSubmitting, setFtfSubmitting] = useState(false)
  const [ftfSubmitted, setFtfSubmitted] = useState(false)
  const [ftfError, setFtfError] = useState('')
  const [ftfName, setFtfName] = useState('')
  const [ftfEmail, setFtfEmail] = useState('')
  const [ftfPhone, setFtfPhone] = useState('')
  const [ftfRole, setFtfRole] = useState('')
  const [slots, setSlots] = useState<SlotData>({})

  useEffect(() => {
    fetch('/api/events/5k-slots')
      .then(r => r.json())
      .then(setSlots)
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const interests = fd.getAll('interests').join(', ')

    const res = await fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${fd.get('first_name')} ${fd.get('last_name')}`,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        availability: fd.get('availability') as string,
        interests,
        experience: fd.get('experience') as string,
      }),
    })

    if (!res.ok) {
      setError('Something went wrong. Please try again or call us at (406) 489-0382.')
    } else {
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setSubmitting(false)
  }

  async function handleFtfSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFtfError('')
    if (!ftfRole) {
      setFtfError('Please select a volunteer role.')
      return
    }
    setFtfSubmitting(true)
    const res = await fetch('/api/events/5k-staff-volunteer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: ftfName, email: ftfEmail, phone: ftfPhone, role: ftfRole }),
    })
    const data = await res.json()
    if (!res.ok) {
      setFtfError(data.error ?? 'Something went wrong. Please try again.')
    } else {
      setFtfSubmitted(true)
    }
    setFtfSubmitting(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[#2D1606] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="w-12 h-1 bg-[#D4A017] mb-5 rounded-full" />
          <div className="flex items-center gap-4 mb-3">
            <Image src="/logo.png" alt="Logo" width={56} height={56} className="rounded bg-white p-1" />
            <h1 className="font-display text-4xl font-bold text-[#D4A017]">
              Volunteer with Us
            </h1>
          </div>
          <p className="text-amber-50/80 max-w-xl text-lg">
            Annie Oakley Animal Rescue runs on the kindness of people like you.
            Every hour you give saves lives.
          </p>
        </div>
      </div>

      {/* Volunteer role cards */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-[#2D1606] mb-8 text-center">Ways to Help</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VOLUNTEER_ROLES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A017]/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#D4A017]" />
                </div>
                <h3 className="font-display font-bold text-[#2D1606]">{label}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fetch the Finish Line Volunteer Section ──────────── */}
      <section className="bg-[#2D1606] py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <Image src="/fetch-5k.png" alt="Fetch the Finish Line" width={72} height={72} className="object-contain" />
            <div>
              <p className="text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-1">Event Volunteering</p>
              <h2 className="font-display text-3xl font-bold text-white leading-tight">
                Volunteer at Fetch the Finish Line
              </h2>
              <p className="text-amber-100/60 text-sm mt-1">June 20, 2026 · Sharbono Park, Fairview MT</p>
            </div>
          </div>

          {/* Role cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {STAFF_ROLES.map(role => {
              const slot = slots[role.id]
              const full = slot ? slot.remaining === 0 : false
              return (
                <div
                  key={role.id}
                  className={`rounded-2xl p-5 border transition-colors ${
                    full
                      ? 'bg-white/5 border-white/10 opacity-60'
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-white text-sm">{role.label}</h3>
                    {slot && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        full
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-[#D4A017]/20 text-[#D4A017]'
                      }`}>
                        {full ? 'Full' : `${slot.remaining} of ${slot.max} open`}
                      </span>
                    )}
                  </div>
                  <p className="text-amber-100/60 text-xs leading-relaxed">{role.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Sign-up form */}
          {ftfSubmitted ? (
            <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2D1606]">You&apos;re In!</h3>
              <p className="text-stone-500 max-w-sm">
                Thank you for signing up to volunteer at Fetch the Finish Line. We&apos;ll be in touch with details before race day!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleFtfSubmit}
              className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
            >
              <h3 className="font-display text-xl font-bold text-[#2D1606]">Sign Up to Volunteer</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FtfField label="Full Name" value={ftfName} onChange={setFtfName} required placeholder="First & Last Name" />
                <FtfField label="Email" type="email" value={ftfEmail} onChange={setFtfEmail} required placeholder="you@example.com" />
              </div>
              <FtfField label="Phone" type="tel" value={ftfPhone} onChange={setFtfPhone} placeholder="(406) 555-0000" />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-stone-700">
                  Volunteer Role <span className="text-[#D4A017]">*</span>
                </label>
                <div className="flex flex-col gap-2">
                  {STAFF_ROLES.map(role => {
                    const slot = slots[role.id]
                    const full = slot ? slot.remaining === 0 : false
                    return (
                      <label
                        key={role.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          full
                            ? 'opacity-40 cursor-not-allowed border-stone-200 bg-stone-50'
                            : ftfRole === role.id
                            ? 'border-[#D4A017] bg-amber-50'
                            : 'border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ftf_role"
                          value={role.id}
                          disabled={full}
                          checked={ftfRole === role.id}
                          onChange={() => setFtfRole(role.id)}
                          className="accent-[#D4A017] w-4 h-4 flex-shrink-0"
                        />
                        <span className="flex-1">
                          <span className="font-semibold text-stone-800 text-sm">{role.label}</span>
                          {slot && (
                            <span className={`ml-2 text-xs font-semibold ${full ? 'text-red-400' : 'text-stone-400'}`}>
                              {full ? '(Full)' : `(${slot.remaining} spot${slot.remaining !== 1 ? 's' : ''} left)`}
                            </span>
                          )}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {ftfError && (
                <p className="text-red-500 text-sm">{ftfError}</p>
              )}

              <button
                type="submit"
                disabled={ftfSubmitting}
                className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20"
              >
                {ftfSubmitting ? 'Signing Up…' : 'Sign Me Up to Volunteer!'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* General sign-up form */}
      <section className="bg-amber-50 py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-12 h-1 bg-[#D4A017] mx-auto mb-4 rounded-full" />
            <h2 className="font-display text-3xl font-bold text-[#2D1606]">Sign Up to Volunteer</h2>
            <p className="text-stone-500 mt-2">Fill out this quick form and we'll be in touch!</p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl border border-amber-100 p-10 text-center flex flex-col items-center gap-4">
              <div className="text-4xl">💛</div>
              <h3 className="font-display text-2xl font-bold text-[#2D1606]">Thank You!</h3>
              <p className="text-stone-500">
                We've received your sign-up and will reach out soon. We're so grateful
                for your willingness to help!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-amber-100 rounded-2xl p-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" name="first_name" required />
                <Field label="Last Name" name="last_name" required />
              </div>
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone Number" name="phone" type="tel" placeholder="(000) 000-0000" />

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-stone-700">
                  Areas of Interest <span className="text-[#D4A017]">*</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VOLUNTEER_ROLES.map(({ label }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="interests" value={label} className="accent-[#D4A017] w-4 h-4" />
                      <span className="text-sm text-stone-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Field label="Availability (days/times that work best for you)" name="availability" as="textarea" required />
              <Field label="Any relevant experience or skills you'd like to share?" name="experience" as="textarea" />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20"
              >
                {submitting ? 'Submitting…' : 'Sign Me Up!'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

function FtfField({
  label, value, onChange, type = 'text', required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-stone-700">
        {label} {required && <span className="text-[#D4A017]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017] transition-colors"
      />
    </div>
  )
}

function Field({ label, name, type = 'text', required, placeholder, as }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; as?: 'textarea'
}) {
  const base = 'w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent placeholder:text-stone-300 text-sm'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-stone-700">{label} {required && <span className="text-[#D4A017]">*</span>}</label>
      {as === 'textarea'
        ? <textarea name={name} required={required} placeholder={placeholder} rows={3} className={`${base} resize-y`} />
        : <input name={name} type={type} required={required} placeholder={placeholder} className={base} />}
    </div>
  )
}
