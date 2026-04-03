'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Phone, Mail } from 'lucide-react'

export default function SurrenderPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries())

    const payload = {
      type: 'surrender',
      applicant_name: `${data.first_name} ${data.last_name}`,
      applicant_email: data.email,
      applicant_phone: data.phone,
      applicant_address: data.address,
      applicant_city: data.city,
      applicant_state: data.state || 'MT',
      applicant_zip: data.zip,
      surrender_animal_name: data.animal_name,
      surrender_species: data.species,
      surrender_breed: data.breed,
      surrender_age: data.animal_age,
      surrender_reason: data.surrender_reason,
      ownership_confirmed: data.ownership_confirmed === 'yes',
      transfer_agreed: data.transfer_agreed === 'yes',
      ...data,
    }

    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setError('Something went wrong. Please call us directly at (406) 489-0382.')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 max-w-lg text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-3xl">🐾</div>
          <h2 className="font-display text-3xl font-bold text-[#2D1606]">Form Received</h2>
          <p className="text-stone-500 leading-relaxed">
            We understand this is a difficult situation and we're here to help.
            A member of our team will reach out to you soon. You can also call us
            directly at{' '}
            <a href="tel:4064890382" className="text-[#D4A017] font-semibold">(406) 489-0382</a>.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#D4A017] text-[#2D1606] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[#2D1606] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-1 bg-[#D4A017] mb-5 rounded-full" />
          <div className="flex items-center gap-4 mb-3">
            <Image src="/logo.png" alt="Logo" width={56} height={56} className="rounded bg-white p-1" />
            <h1 className="font-display text-4xl font-bold">
              Surrender <span className="text-[#D4A017]">an Animal</span>
            </h1>
          </div>
          <p className="text-amber-200/80 max-w-xl">
            We understand that circumstances change. Please reach out to us before
            submitting if possible — we want this process to be as smooth and
            compassionate as possible for you and your pet.
          </p>
        </div>
      </div>

      {/* Contact first prompt */}
      <div className="bg-amber-50 border-b border-amber-100 py-5 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
          <p className="text-stone-600 font-medium text-sm">Please call or email us first if you can:</p>
          <div className="flex gap-4">
            <a href="tel:4064890382" className="flex items-center gap-2 text-[#D4A017] font-semibold text-sm hover:underline">
              <Phone className="w-4 h-4" /> (406) 489-0382
            </a>
            <a href="mailto:annieoakleyanimalrescue@gmail.com" className="flex items-center gap-2 text-[#D4A017] font-semibold text-sm hover:underline">
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-10">

        {/* ── Your Info ── */}
        <Section title="Your Information">
          <TwoCol>
            <Field label="First Name" name="first_name" required />
            <Field label="Last Name" name="last_name" required />
          </TwoCol>
          <TwoCol>
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone Number" name="phone" type="tel" placeholder="(000) 000-0000" required />
          </TwoCol>
          <Field label="Street Address" name="address" required />
          <ThreeCol>
            <Field label="City" name="city" required />
            <Field label="State" name="state" defaultValue="MT" required />
            <Field label="Zip Code" name="zip" required />
          </ThreeCol>
        </Section>

        {/* ── Animal Info ── */}
        <Section title="About the Animal">
          <TwoCol>
            <Field label="Animal's Name" name="animal_name" required />
            <Field label="Species (dog, cat, etc.)" name="species" required />
          </TwoCol>
          <TwoCol>
            <Field label="Breed" name="breed" />
            <Field label="Age" name="animal_age" required />
          </TwoCol>
          <RadioGroup label="Sex" name="animal_sex" options={['Male', 'Female', 'Unknown']} required />
          <RadioGroup label="Is the animal spayed or neutered?" name="altered" options={['Yes', 'No', 'Unknown']} />
          <RadioGroup label="Is the animal up to date on vaccines?" name="vaccinated" options={['Yes', 'No', 'Unknown']} />
          <Field label="Any known medical conditions or special needs?" name="medical_notes" as="textarea" />
          <Field label="Describe the animal's temperament and behavior" name="temperament" as="textarea" required />
          <RadioGroup label="Is the animal good with other dogs?" name="good_with_dogs" options={['Yes', 'No', 'Unknown']} />
          <RadioGroup label="Is the animal good with cats?" name="good_with_cats" options={['Yes', 'No', 'Unknown']} />
          <RadioGroup label="Is the animal good with children?" name="good_with_kids" options={['Yes', 'No', 'Unknown']} />
        </Section>

        {/* ── Reason ── */}
        <Section title="Reason for Surrender">
          <Field
            label="Please explain why you are surrendering this animal"
            name="surrender_reason"
            as="textarea"
            required
          />
          <Field
            label="How long have you owned this animal?"
            name="ownership_duration"
            required
          />
        </Section>

        {/* ── Legal ── */}
        <Section title="Ownership & Transfer Agreement">
          <p className="text-stone-500 text-sm leading-relaxed bg-amber-50 rounded-xl p-4 border border-amber-100">
            Per Montana law, by submitting this form you are confirming that you are the
            lawful owner of this animal (or have the authority to surrender it), and that
            you are voluntarily transferring full ownership and responsibility to Annie Oakley
            Animal Rescue. Annie Oakley Animal Rescue will determine the best placement for
            the animal at their sole discretion.
          </p>
          <CheckboxField
            name="ownership_confirmed"
            label="I confirm that I am the lawful owner of this animal and have the right to surrender it."
            required
          />
          <CheckboxField
            name="transfer_agreed"
            label="I agree to voluntarily transfer full ownership of this animal to Annie Oakley Animal Rescue."
            required
          />
        </Section>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20"
        >
          {submitting ? 'Submitting…' : 'Submit Surrender Form'}
        </button>

        <p className="text-center text-stone-400 text-sm">
          We are here to help — please don't hesitate to call{' '}
          <a href="tel:4064890382" className="text-[#D4A017] hover:underline">(406) 489-0382</a>
        </p>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-6 h-1 bg-[#D4A017] rounded-full" />
        <h2 className="font-display text-xl font-bold text-[#2D1606]">{title}</h2>
      </div>
      <div className="flex flex-col gap-4 bg-white border border-amber-100 rounded-2xl p-6">{children}</div>
    </div>
  )
}

function Field({ label, name, type = 'text', required, placeholder, as, defaultValue }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; as?: 'textarea'; defaultValue?: string
}) {
  const base = 'w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent placeholder:text-stone-300 text-sm'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-stone-700">{label} {required && <span className="text-[#D4A017]">*</span>}</label>
      {as === 'textarea'
        ? <textarea name={name} required={required} placeholder={placeholder} rows={3} className={`${base} resize-y`} defaultValue={defaultValue} />
        : <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className={base} />}
    </div>
  )
}

function RadioGroup({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-stone-700">{label} {required && <span className="text-[#D4A017]">*</span>}</p>
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={name} value={opt} required={required} className="accent-[#D4A017] w-4 h-4" />
            <span className="text-sm text-stone-600">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function CheckboxField({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input type="checkbox" name={name} value="yes" required={required} className="accent-[#D4A017] w-4 h-4 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-stone-600 leading-relaxed">{label}</span>
    </label>
  )
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}

function ThreeCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{children}</div>
}
