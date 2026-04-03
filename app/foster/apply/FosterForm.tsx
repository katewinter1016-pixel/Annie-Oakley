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

export default function FosterForm({ animal }: { animal: Animal }) {
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
      type: 'foster',
      applicant_name: `${data.first_name} ${data.last_name}`,
      applicant_email: data.email,
      applicant_phone: data.phone_cellular,
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
          {animal?.photo_urls?.[0] && (
            <div className="relative h-64 w-full">
              <Image src={animal.photo_urls[0]} alt={animal.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1606]/60 to-transparent" />
              <p className="absolute bottom-4 left-6 font-display text-3xl font-bold text-white">{animal.name}</p>
            </div>
          )}
          <div className="p-8 text-center flex flex-col items-center gap-4">
            {!animal?.photo_urls?.[0] && (
              <div className="w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-3xl">🏠</div>
            )}
            <h2 className="font-display text-3xl font-bold text-[#2D1606]">Application Submitted!</h2>
            <p className="text-stone-500 leading-relaxed">
              {animal
                ? `${animal.name} will be so happy to hear of your interest in them! We've received your foster application and a member of our team will be in touch soon.`
                : "We've received your foster application and will be in touch soon!"}
            </p>
            <p className="text-stone-400 text-sm">
              Questions? Call{' '}
              <a href="tel:4064890382" className="text-[#D4A017] font-semibold hover:underline">(406) 489-0382</a>
            </p>
            <div className="flex gap-3 flex-wrap justify-center pt-2">
              <button
                onClick={() => router.push('/foster')}
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

  return (
    <div className="bg-amber-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#2D1606] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/foster" className="text-amber-300/60 hover:text-[#D4A017] text-sm mb-4 inline-block transition-colors">
            ← Back to Animals
          </Link>
          <div className="w-12 h-1 bg-[#D4A017] mb-5 rounded-full" />
          <h1 className="font-display text-4xl font-bold">
            {animal ? <>Fostering <span className="text-[#D4A017]">{animal.name}</span></> : <>Foster <span className="text-[#D4A017]">Application</span></>}
          </h1>
          {animal && (
            <p className="text-amber-200/70 mt-2 capitalize">
              {[animal.species, animal.breed, animal.sex].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className="text-amber-200/60 mt-3 text-sm">Fields marked with <span className="text-[#D4A017]">*</span> are required.</p>
        </div>
      </div>

      {animal?.photo_urls?.[0] && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={animal.photo_urls[0]} alt={animal.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-[#2D1606]">Applying to foster: {animal.name}</p>
              <p className="text-stone-500 text-sm capitalize">{[animal.species, animal.breed, animal.sex].filter(Boolean).join(' · ')}</p>
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
            <Field label="Age" name="age" type="number" required />
            <Field label="Email" name="email" type="email" required />
          </TwoCol>
          <Field label="Street Address" name="address" required />
          <ThreeCol>
            <Field label="City" name="city" required />
            <Field label="State" name="state" defaultValue="MT" required />
            <Field label="Zip Code" name="zip" required />
          </ThreeCol>
          <TwoCol>
            <Field label="Home Phone" name="phone_home" type="tel" placeholder="(000) 000-0000" />
            <Field label="Cellular Phone" name="phone_cellular" type="tel" placeholder="(000) 000-0000" required />
          </TwoCol>
          <Field label="Work Phone" name="phone_work" type="tel" placeholder="(000) 000-0000" />
        </Section>

        <Section title="Your Household">
          <RadioGroup label="Type of home" name="home_type" options={['House', 'Apartment', 'Condo', 'Mobile Home', 'Other']} required />
          <RadioGroup label="Do you:" name="ownership_type" options={['Own', 'Rent', 'Live with Parents', 'Other']} required />
          <Field label="If renting, please provide landlord contact information" name="landlord_contact" as="textarea" />
          <RadioGroup label="Household setting" name="household_setting" options={['Rural', 'City / Town']} required />
          <RadioGroup label="Describe the activity level in your home" name="activity_level" options={['Busy / Noisy', 'Moderate Comings & Goings', 'Quiet with Occasional Guests']} required />
          <Field label="Please list all people living in the household (name, relationship, age)" name="household_members" as="textarea" required />
          <RadioGroup label="Does anyone in your household have allergies to animals?" name="household_allergies" options={['Yes', 'No']} required />
          <RadioGroup label="Are all members of your family agreeable to fostering a dog or cat?" name="family_agreement" options={['Yes', 'No']} required />
        </Section>

        <Section title="Pet History">
          <Field label="Please list any pets you have (living or deceased) — include name, breed, age, altered, sex, vaccines, heartworm status" name="pets_history" as="textarea" required />
          <RadioGroup label="Would you be willing to have an Annie Oakley team member call your veterinarian for a reference check?" name="vet_reference_ok" options={['Yes', 'No']} required />
          <TwoCol>
            <Field label="Veterinarian First Name" name="vet_first" required />
            <Field label="Veterinarian Last Name" name="vet_last" required />
          </TwoCol>
          <Field label="Veterinarian Address" name="vet_address" required />
        </Section>

        <Section title="Foster Preferences">
          <RadioGroup label="Do you have a preference for the sex of your foster?" name="foster_sex_pref" options={['Male', 'Female', 'No Preference']} required />
          <RadioGroup label="Are you willing to foster a dog or cat of any age?" name="foster_any_age" options={['Yes', 'No']} required />
          <Field label="If not, what age range would you consider?" name="foster_age_pref" />
          <CheckboxGroup label="What size are you willing to foster? (Check all that apply)" name="foster_size_pref" options={['Small', 'Medium', 'Large', 'Extra-Large', 'Any size']} />
          <Field label="Please describe the type of animal you are willing to foster (breed, coat, personality, energy level, hypoallergenic needs, etc.)" name="foster_description" as="textarea" required />
        </Section>

        <Section title="Fostering Commitments">
          <RadioGroup label="Are you willing to take your foster to vet appointments?" name="willing_vet_appts" options={['Yes', 'No']} required />
          <Field label="If no, please explain" name="vet_appts_no_reason" as="textarea" />
          <RadioGroup label="Are you willing and able to medicate your foster (including heartworm preventative)?" name="willing_medicate" options={['Yes', 'No']} required />
          <RadioGroup label="Are you equipped to train with love and patience if the animal is not housebroken?" name="willing_train" options={['Yes', 'No']} required />
          <RadioGroup label="Have you had experience with neglected or abused animals?" name="neglect_experience" options={['Yes', 'No']} required />
          <Field label="If yes, please explain" name="neglect_experience_details" as="textarea" />
          <RadioGroup label="Are you willing to use a crate for a dog if recommended?" name="willing_crate" options={['Yes', 'No']} required />
        </Section>

        <Section title="Home Environment">
          <RadioGroup label="Do you have a fenced yard?" name="fenced_yard" options={['Yes', 'No', 'Partial']} required />
          <Field label="If fenced, describe: height, material, number of gates, lockable?" name="fence_details" as="textarea" />
          <Field label="How many hours per day would the foster be left alone?" name="hours_alone" type="number" required />
          <Field label="What are your exercise plans? (nearby parks, walks per day, activities)" name="exercise_plans" as="textarea" required />
        </Section>

        <Section title="Agreement">
          <p className="text-stone-500 text-sm leading-relaxed bg-amber-100 rounded-xl p-4 border border-amber-200">
            By submitting this form I confirm I have read this questionnaire fully. I understand applying does not ensure approval. I accept full responsibility for the foster animal at all times and release Annie Oakley Animal Rescue from liability. I agree to allow reference checks and a home visit. If I can no longer foster, I will return the animal and allow a 2-week period to find another placement.
          </p>
          <CheckboxField name="agreement_confirmed" label="I have read and agree to the above terms." required />
          <TwoCol>
            <Field label="Your Full Name (signature)" name="signature_name" required />
            <Field label="Co-Applicant Name (if applicable)" name="co_applicant" />
          </TwoCol>
        </Section>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20"
        >
          {submitting ? 'Submitting…' : animal ? `Apply to Foster ${animal.name}` : 'Submit Foster Application'}
        </button>

        <p className="text-center text-stone-400 text-sm">
          Questions? Call <a href="tel:4064890382" className="text-[#D4A017] hover:underline">(406) 489-0382</a>
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

function CheckboxGroup({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-stone-700">{label}</p>
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name={name} value={opt} className="accent-[#D4A017] w-4 h-4" />
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
