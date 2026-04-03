'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Suspense } from 'react'

// We wrap the form in Suspense because useSearchParams() needs it in Next.js
export default function AdoptPage() {
  return (
    <Suspense>
      <AdoptForm />
    </Suspense>
  )
}

function AdoptForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const animalId = searchParams.get('animal') // pre-filled if coming from an animal's page

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // FormData reads all the input values from the form at once
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries())

    const payload = {
      type: 'adoption',
      applicant_name: `${data.first_name} ${data.last_name}`,
      applicant_email: data.email,
      applicant_phone: data.phone,
      applicant_address: data.address,
      applicant_city: data.city,
      applicant_state: data.state || 'MT',
      applicant_zip: data.zip,
      animal_id: animalId ?? null,
      // All the extra fields go into form_data
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
      setError('Something went wrong. Please try again or call us at (406) 489-0382.')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 max-w-lg text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center">
            <span className="text-3xl">🐾</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-[#2D1606]">Application Received!</h2>
          <p className="text-stone-500 leading-relaxed">
            Thank you for taking this step. We've received your adoption application
            and a member of our team will be in touch soon. In the meantime, feel
            free to call us at{' '}
            <a href="tel:4064890382" className="text-[#D4A017] font-semibold">(406) 489-0382</a>.
          </p>
          <button
            onClick={() => router.push('/animals')}
            className="bg-[#D4A017] text-[#2D1606] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
          >
            Browse More Animals
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
              Adoption <span className="text-[#D4A017]">Application</span>
            </h1>
          </div>
          <p className="text-amber-200/80 max-w-xl">
            We review every application carefully to make the best match. Fields marked
            with <span className="text-[#D4A017]">*</span> are required.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-10">

        {/* ── SECTION 1: Personal Info ── */}
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
          <Field label="Street Address Line 2" name="address2" />
          <ThreeCol>
            <Field label="City" name="city" required />
            <Field label="State" name="state" defaultValue="MT" required />
            <Field label="Zip Code" name="zip" required />
          </ThreeCol>
        </Section>

        {/* ── SECTION 2: About the Animal ── */}
        <Section title="About the Animal">
          <Field
            label="How did you hear about us? Which animal are you interested in?"
            name="how_heard"
            required
          />
          <Field
            label="What made you decide you want to adopt a dog or cat?"
            name="why_dog_cat"
            as="textarea"
            required
          />
        </Section>

        {/* ── SECTION 3: Living Situation ── */}
        <Section title="Your Living Situation">
          <TwoCol>
            <Field label="Type of dwelling (house, apartment, etc.)" name="dwelling_type" required />
            <Field label="How long have you lived there?" name="dwelling_duration" required />
          </TwoCol>
          <Field label="Do you rent or own?" name="rent_or_own" required />
          <RadioGroup
            label="If you rent, are you ok with us contacting your landlord?"
            name="landlord_ok"
            options={['Yes', 'No', 'N/A — I own']}
          />
          <Field label="Landlord name and phone number (if renting)" name="landlord_contact" as="textarea" />
          <RadioGroup
            label="Do you have a secure fence? (Required for dogs)"
            name="secure_fence"
            options={['Yes', 'No', 'Not adopting a dog']}
          />
        </Section>

        {/* ── SECTION 4: Pet History ── */}
        <Section title="Pet History">
          <RadioGroup
            label="Have you had animals before?"
            name="had_animals_before"
            options={['Yes', 'No']}
            required
          />
          <RadioGroup
            label="Have you ever had to give up an animal?"
            name="given_up_animal"
            options={['Yes', 'No']}
            required
          />
          <Field
            label="If yes, for what reason?"
            name="given_up_reason"
            as="textarea"
          />
          <Field
            label="How many other pets do you currently have, and what are they?"
            name="other_pets"
            as="textarea"
            required
          />
          <RadioGroup
            label="Is anyone in your household allergic to animals?"
            name="household_allergies"
            options={['Yes', 'No']}
            required
          />
          <RadioGroup
            label="Is everyone in your household in agreement about adopting?"
            name="household_agreement"
            options={['Yes', 'No']}
            required
          />
        </Section>

        {/* ── SECTION 5: Care Plans ── */}
        <Section title="Care & Responsibility">
          <Field
            label="Who will be responsible for training, feeding, and exercising the animal?"
            name="who_will_care"
            required
          />
          <RadioGroup
            label="If adopting a dog — will it ever be tied up outside?"
            name="dog_tied_up"
            options={['Yes', 'No', 'Not adopting a dog']}
            required
          />
          <Field label="Who is your veterinarian?" name="vet_name" required />
        </Section>

        {/* ── SECTION 6: Reference ── */}
        <Section title="Personal Reference (Non-Family)">
          <TwoCol>
            <Field label="Reference First Name" name="reference_first" required />
            <Field label="Reference Last Name" name="reference_last" required />
          </TwoCol>
          <Field label="Reference Phone Number" name="reference_phone" type="tel" placeholder="(000) 000-0000" required />
          <RadioGroup
            label="May we visit your home before and/or after adoption?"
            name="home_visit_ok"
            options={['Yes', 'No']}
            required
          />
        </Section>

        {/* ── SECTION 7: Agreements ── */}
        <Section title="Agreements">
          <p className="text-stone-500 text-sm -mt-2 mb-2">
            Please read and check each of the following statements:
          </p>
          <CheckboxField
            name="agree_care"
            label="I/we agree that if we adopt a dog or cat, we will provide professional veterinary care, a nutritious diet, and a loving home."
            required
          />
          <CheckboxField
            name="agree_return"
            label="I/we agree that we will return the dog or cat to Annie Oakley Animal Rescue if we can no longer keep it."
            required
          />
          <CheckboxField
            name="agree_no_cruelty"
            label="No member of our household has ever been convicted of cruelty to animals."
            required
          />
        </Section>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20"
        >
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>

        <p className="text-center text-stone-400 text-sm">
          Questions? Call{' '}
          <a href="tel:4064890382" className="text-[#D4A017] hover:underline">(406) 489-0382</a>{' '}
          or email{' '}
          <a href="mailto:annieoakleyanimalrescue@gmail.com" className="text-[#D4A017] hover:underline">
            annieoakleyanimalrescue@gmail.com
          </a>
        </p>
      </form>
    </div>
  )
}

// ── Reusable form building blocks ─────────────────────────────────
// These small components let us build the form cleanly without
// repeating the same label/input markup over and over.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-6 h-1 bg-[#D4A017] rounded-full" />
        <h2 className="font-display text-xl font-bold text-[#2D1606]">{title}</h2>
      </div>
      <div className="flex flex-col gap-4 bg-white border border-amber-100 rounded-2xl p-6">
        {children}
      </div>
    </div>
  )
}

function Field({
  label, name, type = 'text', required, placeholder, as, defaultValue,
}: {
  label: string; name: string; type?: string; required?: boolean
  placeholder?: string; as?: 'textarea'; defaultValue?: string
}) {
  const base = 'w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent placeholder:text-stone-300 text-sm'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-stone-700">
        {label} {required && <span className="text-[#D4A017]">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea name={name} required={required} placeholder={placeholder} rows={3}
          className={`${base} resize-y`} defaultValue={defaultValue} />
      ) : (
        <input name={name} type={type} required={required} placeholder={placeholder}
          defaultValue={defaultValue} className={base} />
      )}
    </div>
  )
}

function RadioGroup({ label, name, options, required }: {
  label: string; name: string; options: string[]; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-stone-700">
        {label} {required && <span className="text-[#D4A017]">*</span>}
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={name} value={opt} required={required}
              className="accent-[#D4A017] w-4 h-4" />
            <span className="text-sm text-stone-600">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function CheckboxField({ name, label, required }: {
  name: string; label: string; required?: boolean
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input type="checkbox" name={name} value="yes" required={required}
        className="accent-[#D4A017] w-4 h-4 mt-0.5 flex-shrink-0" />
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
