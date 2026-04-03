'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function FosterPage() {
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
          <div className="w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-3xl">🏠</div>
          <h2 className="font-display text-3xl font-bold text-[#2D1606]">Application Received!</h2>
          <p className="text-stone-500 leading-relaxed">
            Thank you for opening your home. We've received your foster application and
            will be in touch soon. Call us anytime at{' '}
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
              Foster <span className="text-[#D4A017]">Application</span>
            </h1>
          </div>
          <p className="text-amber-200/80 max-w-xl">
            Fostering saves lives. Thank you for considering it. Fields marked with{' '}
            <span className="text-[#D4A017]">*</span> are required.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-10">

        {/* ── Personal Info ── */}
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

        {/* ── Household ── */}
        <Section title="Your Household">
          <RadioGroup
            label="Type of home"
            name="home_type"
            options={['House', 'Apartment', 'Condo', 'Mobile Home', 'Other']}
            required
          />
          <RadioGroup
            label="Do you:"
            name="ownership_type"
            options={['Own', 'Rent', 'Live with Parents', 'Other']}
            required
          />
          <Field
            label="If renting, please provide landlord contact information"
            name="landlord_contact"
            as="textarea"
          />
          <RadioGroup
            label="Household setting"
            name="household_setting"
            options={['Rural', 'City / Town']}
            required
          />
          <RadioGroup
            label="Describe the activity level in your home"
            name="activity_level"
            options={['Busy / Noisy', 'Moderate Comings & Goings', 'Quiet with Occasional Guests']}
            required
          />
          <Field
            label="Please list all people living in the household (name, relationship, age)"
            name="household_members"
            as="textarea"
            required
          />
          <RadioGroup
            label="Does anyone in your household have allergies to animals?"
            name="household_allergies"
            options={['Yes', 'No']}
            required
          />
          <RadioGroup
            label="Are all members of your family agreeable to fostering a dog or cat?"
            name="family_agreement"
            options={['Yes', 'No']}
            required
          />
        </Section>

        {/* ── Pet History ── */}
        <Section title="Pet History">
          <Field
            label="Please list any pets you have (living or deceased) — include name, breed, age, altered, sex, vaccines, heartworm status"
            name="pets_history"
            as="textarea"
            required
          />
          <RadioGroup
            label="Would you be willing to have an Annie Oakley team member call your veterinarian for a reference check?"
            name="vet_reference_ok"
            options={['Yes', 'No']}
            required
          />
          <TwoCol>
            <Field label="Veterinarian First Name" name="vet_first" required />
            <Field label="Veterinarian Last Name" name="vet_last" required />
          </TwoCol>
          <Field label="Veterinarian Address" name="vet_address" required />
        </Section>

        {/* ── Foster Preferences ── */}
        <Section title="Foster Preferences">
          <RadioGroup
            label="Do you have a preference for the sex of your foster?"
            name="foster_sex_pref"
            options={['Male', 'Female', 'No Preference']}
            required
          />
          <RadioGroup
            label="Are you willing to foster a dog or cat of any age?"
            name="foster_any_age"
            options={['Yes', 'No']}
            required
          />
          <Field
            label="If not willing to foster any age, what age range would you consider?"
            name="foster_age_pref"
          />
          <CheckboxGroup
            label="What size dog or cat are you willing to foster? (Check all that apply)"
            name="foster_size_pref"
            options={['Small', 'Medium', 'Large', 'Extra-Large', 'Any size']}
          />
          <Field
            label="Please describe the type of dog or cat you are willing to foster (breed, coat length, personality, energy level, hypoallergenic needs, etc.)"
            name="foster_description"
            as="textarea"
            required
          />
        </Section>

        {/* ── Fostering Commitments ── */}
        <Section title="Fostering Commitments">
          <RadioGroup
            label="Are you willing to take your foster to vet appointments at a convenient time for you?"
            name="willing_vet_appts"
            options={['Yes', 'No']}
            required
          />
          <Field
            label="If no, please explain"
            name="vet_appts_no_reason"
            as="textarea"
          />
          <RadioGroup
            label="Are you willing and able to medicate your foster (including monthly heartworm preventative)?"
            name="willing_medicate"
            options={['Yes', 'No']}
            required
          />
          <RadioGroup
            label="We cannot guarantee a dog or cat to be housebroken or litterbox trained — are you equipped to train with love and patience?"
            name="willing_train"
            options={['Yes', 'No']}
            required
          />
          <RadioGroup
            label="Have you had experience with emotionally or physically neglected or abused animals?"
            name="neglect_experience"
            options={['Yes', 'No']}
            required
          />
          <Field label="If yes, please explain" name="neglect_experience_details" as="textarea" />
          <RadioGroup
            label="Are you willing to use a crate for a dog if recommended?"
            name="willing_crate"
            options={['Yes', 'No']}
            required
          />
        </Section>

        {/* ── Home Environment ── */}
        <Section title="Home Environment">
          <RadioGroup
            label="Do you have a fenced yard?"
            name="fenced_yard"
            options={['Yes', 'No', 'Partial']}
            required
          />
          <Field
            label="If fenced, please describe: height, material, number of gates, are gates locked or lockable?"
            name="fence_details"
            as="textarea"
          />
          <Field
            label="How many hours per day would the foster animal be left alone?"
            name="hours_alone"
            type="number"
            required
          />
          <Field
            label="What are your plans for exercise? List nearby parks/trails, walks per day, approximate length, and activities."
            name="exercise_plans"
            as="textarea"
            required
          />
        </Section>

        {/* ── Agreement ── */}
        <Section title="Agreement">
          <p className="text-stone-500 text-sm leading-relaxed bg-amber-50 rounded-xl p-4 border border-amber-100">
            By submitting this form electronically, I acknowledge that I have completely read
            this questionnaire and comprehend it fully. I understand that applying does not ensure
            approval and that untruthful answers may result in forfeiture of any Annie Oakley
            animal fostered by me. I accept full responsibility for the animal's actions at all times
            and release Annie Oakley Animal Rescue from any liabilities. I agree to allow Annie Oakley
            to complete reference calls and conduct a home visit inspection to approve my application.
            I understand that if I am no longer able to foster, I will return the animal to Annie Oakley
            and give them a 2-week period to find another suitable foster.
          </p>
          <CheckboxField
            name="agreement_confirmed"
            label="I have read and agree to the above terms."
            required
          />
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
          {submitting ? 'Submitting…' : 'Submit Foster Application'}
        </button>

        <p className="text-center text-stone-400 text-sm">
          Questions? Call{' '}
          <a href="tel:4064890382" className="text-[#D4A017] hover:underline">(406) 489-0382</a>
        </p>
      </form>
    </div>
  )
}

// ── Form building blocks ───────────────────────────────────────────
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

function Field({ label, name, type = 'text', required, placeholder, as, defaultValue }: {
  label: string; name: string; type?: string; required?: boolean
  placeholder?: string; as?: 'textarea'; defaultValue?: string
}) {
  const base = 'w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent placeholder:text-stone-300 text-sm'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-stone-700">
        {label} {required && <span className="text-[#D4A017]">*</span>}
      </label>
      {as === 'textarea'
        ? <textarea name={name} required={required} placeholder={placeholder} rows={3} className={`${base} resize-y`} defaultValue={defaultValue} />
        : <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className={base} />
      }
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

function CheckboxGroup({ label, name, options }: {
  label: string; name: string; options: string[]
}) {
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
