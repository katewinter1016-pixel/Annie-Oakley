'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type Animal = {
  id: string
  name: string
  sex: string | null
  photo_urls: string[] | null
  species: string | null
  breed: string | null
} | null

export default function AdoptForm({ animal }: { animal: Animal }) {
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
      type: 'adoption',
      applicant_name: `${data.first_name} ${data.last_name}`,
      applicant_email: data.email,
      applicant_phone: data.phone,
      applicant_address: data.address,
      applicant_city: data.city,
      applicant_state: data.state || 'MT',
      applicant_zip: data.zip,
      animal_id: animal?.id ?? null,
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

  // ── Success screen ─────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 max-w-lg w-full overflow-hidden">

          {/* Animal photo at top of success card */}
          {animal?.photo_urls?.[0] && (
            <div className="relative h-64 w-full">
              <Image
                src={animal.photo_urls[0]}
                alt={animal.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1606]/60 to-transparent" />
              <p className="absolute bottom-4 left-6 font-display text-3xl font-bold text-white">
                {animal.name}
              </p>
            </div>
          )}

          <div className="p-8 text-center flex flex-col items-center gap-4">
            {!animal?.photo_urls?.[0] && (
              <div className="w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-3xl">🐾</div>
            )}

            <h2 className="font-display text-3xl font-bold text-[#2D1606]">
              Application Submitted!
            </h2>

            <p className="text-stone-500 leading-relaxed">
              {animal
                ? `${animal.name} will be so happy to hear of your interest in them! We've received your application and a member of our team will be in touch soon.`
                : "We've received your adoption application and will be in touch soon!"}
            </p>

            <p className="text-stone-400 text-sm">
              Questions? Call us at{' '}
              <a href="tel:4064890382" className="text-[#D4A017] font-semibold hover:underline">
                (406) 489-0382
              </a>
            </p>

            <div className="flex gap-3 flex-wrap justify-center pt-2">
              <button
                onClick={() => router.push('/adopt')}
                className="bg-[#D4A017] text-[#2D1606] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
              >
                Browse More Animals
              </button>
              <button
                onClick={() => router.push('/')}
                className="border-2 border-stone-200 text-stone-600 px-6 py-3 rounded-full font-bold hover:border-[#D4A017] transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="bg-[#2D1606] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/adopt" className="text-amber-300/60 hover:text-[#D4A017] text-sm mb-4 inline-block transition-colors">
            ← Back to Animals
          </Link>
          <div className="w-12 h-1 bg-[#D4A017] mb-5 rounded-full" />
          <h1 className="font-display text-4xl font-bold">
            {animal ? (
              <>Adopting <span className="text-[#D4A017]">{animal.name}</span></>
            ) : (
              <>Adoption <span className="text-[#D4A017]">Application</span></>
            )}
          </h1>
          {animal && (
            <p className="text-amber-200/70 mt-2">
              {animal.species} {animal.breed ? `· ${animal.breed}` : ''} {animal.sex ? `· ${animal.sex}` : ''}
            </p>
          )}
          <p className="text-amber-200/60 mt-3 text-sm">
            Fields marked with <span className="text-[#D4A017]">*</span> are required.
          </p>
        </div>
      </div>

      {/* Animal preview strip if selected */}
      {animal?.photo_urls?.[0] && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={animal.photo_urls[0]} alt={animal.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-[#2D1606]">Applying to adopt: {animal.name}</p>
              <p className="text-stone-400 text-sm capitalize">
                {[animal.species, animal.breed, animal.sex].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-10">

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

        <Section title="About the Animal">
          <Field label="How did you hear about us? Which animal are you interested in?" name="how_heard" required />
          <Field label="What made you decide you want to adopt a dog or cat?" name="why_dog_cat" as="textarea" required />
        </Section>

        <Section title="Your Living Situation">
          <TwoCol>
            <Field label="Type of dwelling (house, apartment, etc.)" name="dwelling_type" required />
            <Field label="How long have you lived there?" name="dwelling_duration" required />
          </TwoCol>
          <Field label="Do you rent or own?" name="rent_or_own" required />
          <RadioGroup label="If you rent, are you ok with us contacting your landlord?" name="landlord_ok" options={['Yes', 'No', 'N/A — I own']} />
          <Field label="Landlord name and phone number (if renting)" name="landlord_contact" as="textarea" />
          <RadioGroup label="Do you have a secure fence? (Required for dogs)" name="secure_fence" options={['Yes', 'No', 'Not adopting a dog']} />
        </Section>

        <Section title="Pet History">
          <RadioGroup label="Have you had animals before?" name="had_animals_before" options={['Yes', 'No']} required />
          <RadioGroup label="Have you ever had to give up an animal?" name="given_up_animal" options={['Yes', 'No']} required />
          <Field label="If yes, for what reason?" name="given_up_reason" as="textarea" />
          <Field label="How many other pets do you currently have, and what are they?" name="other_pets" as="textarea" required />
          <RadioGroup label="Is anyone in your household allergic to animals?" name="household_allergies" options={['Yes', 'No']} required />
          <RadioGroup label="Is everyone in your household in agreement about adopting?" name="household_agreement" options={['Yes', 'No']} required />
        </Section>

        <Section title="Care & Responsibility">
          <Field label="Who will be responsible for training, feeding, and exercising the animal?" name="who_will_care" required />
          <RadioGroup label="If adopting a dog — will it ever be tied up outside?" name="dog_tied_up" options={['Yes', 'No', 'Not adopting a dog']} required />
          <Field label="Who is your veterinarian?" name="vet_name" required />
        </Section>

        <Section title="Personal Reference (Non-Family)">
          <TwoCol>
            <Field label="Reference First Name" name="reference_first" required />
            <Field label="Reference Last Name" name="reference_last" required />
          </TwoCol>
          <Field label="Reference Phone Number" name="reference_phone" type="tel" placeholder="(000) 000-0000" required />
          <RadioGroup label="May we visit your home before and/or after adoption?" name="home_visit_ok" options={['Yes', 'No']} required />
        </Section>

        <Section title="Agreements">
          <p className="text-stone-500 text-sm -mt-2 mb-1">Please read and check each statement:</p>
          <CheckboxField name="agree_care" label="I/we agree that if we adopt a dog or cat, we will provide professional veterinary care, a nutritious diet, and a loving home." required />
          <CheckboxField name="agree_return" label="I/we agree that we will return the dog or cat to Annie Oakley Animal Rescue if we can no longer keep it." required />
          <CheckboxField name="agree_no_cruelty" label="No member of our household has ever been convicted of cruelty to animals." required />
        </Section>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20"
        >
          {submitting ? 'Submitting…' : animal ? `Apply to Adopt ${animal.name}` : 'Submit Application'}
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

// ── Shared form components ─────────────────────────────────────────
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
