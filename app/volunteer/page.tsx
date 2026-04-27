'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Truck, Camera, DollarSign, CalendarDays, MoreHorizontal } from 'lucide-react'

const VOLUNTEER_ROLES = [
  { icon: Heart, label: 'Animal Care', desc: 'Feeding, socializing, and caring for animals in foster or at events.' },
  { icon: Truck, label: 'Transport', desc: 'Driving animals to vet appointments or between foster homes.' },
  { icon: Camera, label: 'Photography / Social Media', desc: 'Taking photos and helping promote animals online.' },
  { icon: CalendarDays, label: 'Events', desc: 'Helping organize and run adoption events and fundraisers.' },
  { icon: DollarSign, label: 'Fundraising', desc: 'Helping us raise funds to care for animals and build our facility.' },
  { icon: MoreHorizontal, label: 'Other', desc: 'Have a skill that could help? We want to hear from you.' },
]

export default function VolunteerPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

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

      {/* Sign-up form */}
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

              {/* 5K Booth Volunteer */}
              <div className="rounded-2xl border-2 border-[#D4A017] bg-[#D4A017]/5 p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image src="/fetch-5k.png" alt="5K Run" fill className="object-contain" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2D1606] text-sm leading-tight">Fetch the Finish Line 5K — Volunteer at a Booth</p>
                    <p className="text-stone-400 text-xs">Fairview, MT · Sharbono Park · Hosted by Winter Howlers</p>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="interests"
                    value="Volunteer at 5K Booth"
                    className="accent-[#D4A017] w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm text-stone-700 font-medium">
                    I want to volunteer at a booth at the 5K event
                  </span>
                </label>
              </div>

              {/* General interests */}
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
