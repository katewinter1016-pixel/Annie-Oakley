import Link from 'next/link'
import { Heart, Home, AlertCircle } from 'lucide-react'

export default function FormsPage() {
  return (
    <div className="bg-amber-50 min-h-screen">

      {/* Header */}
      <div className="bg-[#2D1606] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="w-12 h-1 bg-[#D4A017] mb-5 rounded-full" />
          <h1 className="font-display text-5xl font-bold mb-3">
            Applications &amp; <span className="text-[#D4A017]">Forms</span>
          </h1>
          <p className="text-amber-100/80 text-lg max-w-2xl">
            Whether you're looking to adopt, open your home as a foster, or need to surrender
            an animal — we're here to help. Select the form that applies to you below.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto px-4 py-14 flex flex-col gap-6">

        <FormCard
          Icon={Heart}
          title="Adoption Application"
          description="Ready to give a rescue animal their forever home? Browse our available dogs and cats and start your adoption application. We review every application carefully to ensure the best match for both you and the animal."
          href="/adopt"
          linkLabel="Browse Animals & Apply"
        />

        <FormCard
          Icon={Home}
          title="Foster Application"
          description="Fostering is one of the most impactful things you can do. Foster families provide a safe, loving home while we find a permanent placement. No experience necessary — just patience and compassion. We'll guide you every step of the way."
          href="/foster"
          linkLabel="Browse Animals & Foster"
        />

        <FormCard
          Icon={AlertCircle}
          title="Surrender an Animal"
          description="We understand that circumstances change. If you are no longer able to care for your animal, Annie Oakley Animal Rescue can help. Please reach out to us before completing a surrender — we want to make this process as smooth and compassionate as possible."
          href="/surrender"
          linkLabel="Surrender Form"
          note="Please call us at (406) 489-0382 or (406) 478-0042 before submitting if possible."
        />

      </div>
    </div>
  )
}

function FormCard({
  Icon, title, description, href, linkLabel, note,
}: {
  Icon: React.ElementType
  title: string
  description: string
  href: string
  linkLabel: string
  note?: string
}) {
  return (
    // Dark brown box, gold title, cream subtext — matching user request
    <div className="bg-[#2D1606] rounded-2xl p-8 flex flex-col sm:flex-row gap-6 shadow-md">

      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-xl bg-[#D4A017]/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#D4A017]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3">
        {/* Gold title in Playfair Display */}
        <h2 className="font-display text-2xl font-bold text-[#D4A017]">{title}</h2>

        {/* Cream subtext */}
        <p className="text-amber-50/80 leading-relaxed text-sm">{description}</p>

        {note && (
          <p className="text-[#D4A017]/70 text-sm font-medium">{note}</p>
        )}

        <Link
          href={href}
          className="self-start mt-2 bg-[#D4A017] text-[#2D1606] px-6 py-2.5 rounded-full font-bold hover:bg-yellow-400 transition-colors text-sm shadow-md"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  )
}
