'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type EmergencyContact = { name: string; phone: string; relation?: string } | null

const TYPE_LABELS: Record<string, string> = {
  tshirt: 'T-Shirt',
  hat: 'Hat',
  individual: 'Individual',
  group: 'Group',
  donate: 'Donation',
}

export default function RegistrationCard({ reg }: { reg: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false)

  const id = reg.id as string
  const contactName = reg.contact_name as string
  const contactEmail = reg.contact_email as string
  const contactPhone = reg.contact_phone as string | null
  const registrationType = reg.registration_type as string
  const createdAt = reg.created_at as string
  const emergency = reg.emergency_contact as EmergencyContact

  return (
    <div key={id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-bold text-stone-800 text-base">{contactName}</span>
          <span className="bg-stone-100 text-stone-500 text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0">
            {TYPE_LABELS[registrationType] ?? registrationType}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 text-stone-400 text-xs">
          {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-stone-100 px-5 py-4 flex flex-col gap-4">
          {/* Contact info */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-stone-600">{contactEmail}</span>
            {contactPhone && <span className="text-stone-500">{contactPhone}</span>}
          </div>

          {/* Emergency contact */}
          {emergency && (
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Emergency Contact</p>
              <p className="text-sm text-stone-700">
                {emergency.name} · {emergency.phone}
                {emergency.relation && <span className="text-stone-400"> ({emergency.relation})</span>}
              </p>
            </div>
          )}

          {/* Waiver */}
          <div className="border-t border-stone-100 pt-3">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Liability Waiver</p>
            <p className="text-sm text-green-600 font-semibold">✓ Accepted</p>
          </div>
        </div>
      )}
    </div>
  )
}
