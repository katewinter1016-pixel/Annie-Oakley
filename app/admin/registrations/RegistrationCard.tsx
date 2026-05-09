'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import PaymentToggle from './PaymentToggle'

type Participant = { name: string; age_category: string; shirt_size: string; price: number }
type MailingAddress = { street: string; city: string; state: string; zip: string } | null
type EmergencyContact = { name: string; phone: string; relation?: string } | null

const ROLE_LABELS: Record<string, string> = {
  'sign-in-booth': 'Sign-In Booth',
  'post-run-booth': 'Post Run Booth',
  'race-setup': 'Race Set-Up',
  'alternate-volunteer': 'Alternate',
}

export default function RegistrationCard({ reg }: { reg: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false)

  const id = reg.id as string
  const contactName = reg.contact_name as string
  const contactEmail = reg.contact_email as string
  const contactPhone = reg.contact_phone as string | null
  const registrationType = reg.registration_type as string
  const createdAt = reg.created_at as string
  const totalCost = reg.total_cost as number
  const paymentReceived = !!(reg.payment_received)
  const volunteerRole = reg.volunteer_role as string | null
  const participants = (reg.participants as Participant[]) ?? []
  const mailing = reg.mailing_address as MailingAddress
  const emergency = reg.emergency_contact as EmergencyContact

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* ── Summary row (always visible) ── */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-bold text-stone-800 text-base">{contactName}</span>
          <span className="bg-stone-100 text-stone-500 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0">
            {registrationType}
          </span>
          {volunteerRole && (
            <span className="bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0">
              Runner vol: {ROLE_LABELS[volunteerRole] ?? volunteerRole}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-bold text-[#D4A017] text-lg">${totalCost}</span>
          <PaymentToggle id={id} initialPaid={paymentReceived} />
          {expanded
            ? <ChevronUp className="w-4 h-4 text-stone-400" />
            : <ChevronDown className="w-4 h-4 text-stone-400" />
          }
        </div>
      </button>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className="border-t border-stone-100 px-5 py-4 flex flex-col gap-4">
          {/* Contact info */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-stone-500">{contactEmail}</span>
            {contactPhone && <span className="text-stone-500">{contactPhone}</span>}
            <span className="text-stone-300 text-xs">
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
              })}
            </span>
          </div>

          {/* Participants + T-shirt sizes */}
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
              Participants &amp; T-Shirt Sizes
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="text-xs text-stone-400 font-semibold pb-1.5 pr-4">Name</th>
                  <th className="text-xs text-stone-400 font-semibold pb-1.5 pr-4">Category</th>
                  <th className="text-xs text-stone-400 font-semibold pb-1.5 pr-4">Shirt</th>
                  <th className="text-xs text-stone-400 font-semibold pb-1.5">Price</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => (
                  <tr key={i}>
                    <td className="text-stone-700 pr-4 pb-1">{p.name}</td>
                    <td className="text-stone-500 pr-4 pb-1 capitalize">{p.age_category}</td>
                    <td className="text-stone-500 pr-4 pb-1">
                      {p.shirt_size
                        ? <span className="bg-stone-100 text-stone-600 text-xs font-bold px-2 py-0.5 rounded">{p.shirt_size}</span>
                        : '—'}
                    </td>
                    <td className="text-stone-500 pb-1">${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Liability + Mailing + Emergency */}
          <div className="flex flex-wrap gap-6 border-t border-stone-100 pt-3">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Liability Waiver</p>
              <p className="text-sm text-green-600 font-semibold">✓ Accepted</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Mailing Address</p>
              {mailing
                ? <p className="text-sm text-stone-700">{mailing.street}, {mailing.city}, {mailing.state} {mailing.zip}</p>
                : <p className="text-sm text-stone-400">Not provided</p>
              }
            </div>
            {emergency && (
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Emergency Contact</p>
                <p className="text-sm text-stone-700">
                  {emergency.name} · {emergency.phone}
                  {emergency.relation && <span className="text-stone-400"> ({emergency.relation})</span>}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
