import Link from 'next/link'
import { Heart, Home, AlertCircle } from 'lucide-react'

// This page lives at yoursite.com/forms
// It gives visitors a clear overview of all three form options
// with a description of each so they know which one to pick.

export default function FormsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-3">Applications & Forms</h1>
      <p className="text-gray-400 mb-12 text-lg">
        Whether you're looking to adopt, open your home as a foster, or need to surrender an animal —
        we're here to help. Select the form that applies to you below.
      </p>

      <div className="flex flex-col gap-6">

        {/* Adoption */}
        <FormCard
          Icon={Heart}
          title="Adoption Application"
          description="Ready to give a rescue animal their forever home? Fill out our adoption application and a member of our team will be in touch to discuss the process. We review every application carefully to ensure the best match for both you and the animal."
          href="/adopt"
          linkLabel="Start Adoption Application"
        />

        {/* Foster */}
        <FormCard
          Icon={Home}
          title="Foster Application"
          description="Fostering is one of the most impactful things you can do for a rescue animal. Foster families provide a safe, loving home while we work to find a permanent placement. No experience necessary — just patience and compassion. We'll guide you through every step."
          href="/foster"
          linkLabel="Start Foster Application"
        />

        {/* Surrender */}
        <FormCard
          Icon={AlertCircle}
          title="Surrender an Animal"
          description="We understand that circumstances change. If you are no longer able to care for your animal, Annie Oakley Animal Rescue can help. Please reach out to us before completing a surrender — we want to make this process as smooth and compassionate as possible for both you and your pet."
          href="/surrender"
          linkLabel="Surrender Form"
          note="Please call us at (406) 489-0382 before submitting if possible."
        />

      </div>
    </div>
  )
}

function FormCard({
  Icon,
  title,
  description,
  href,
  linkLabel,
  note,
}: {
  Icon: React.ElementType
  title: string
  description: string
  href: string
  linkLabel: string
  note?: string
}) {
  return (
    <div className="bg-[#222] border border-gray-700 rounded-2xl p-8 flex flex-col sm:flex-row gap-6">
      <div className="flex-shrink-0">
        <Icon className="w-10 h-10 text-[#D4A017]" />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-400 leading-relaxed">{description}</p>
        {note && (
          <p className="text-sm text-[#D4A017]">{note}</p>
        )}
        <Link
          href={href}
          className="self-start mt-2 bg-[#D4A017] text-[#1a1a1a] px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors text-sm"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  )
}
