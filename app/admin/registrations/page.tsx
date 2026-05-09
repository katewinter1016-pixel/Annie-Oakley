import type { ReactNode } from 'react'
import { getSupabaseServer } from '@/lib/supabaseServer'
import PaymentToggle from './PaymentToggle'

export const dynamic = 'force-dynamic'

type Participant = { name: string; age_category: string; shirt_size: string; price: number }
type MailingAddress = { street: string; city: string; state: string; zip: string } | null

async function getData() {
  const supabase = getSupabaseServer()

  const { data: runners } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', '5k-2026')
    .in('registration_type', ['individual', 'group'])
    .order('created_at', { ascending: false })

  const { data: staffVolunteers } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', '5k-2026')
    .eq('registration_type', 'staff-volunteer')
    .order('created_at', { ascending: false })

  return { runners: runners ?? [], staffVolunteers: staffVolunteers ?? [] }
}

const ROLE_LABELS: Record<string, string> = {
  'sign-in-booth': 'Sign-In Booth',
  'post-run-booth': 'Post Run Booth',
  'race-setup': 'Race Set-Up',
  'alternate-volunteer': 'Alternate',
}

export default async function AdminRegistrationsPage() {
  const { runners, staffVolunteers } = await getData()

  const paid = runners.filter(r => r.payment_received)
  const pending = runners.filter(r => !r.payment_received)

  const totalRevenue = paid.reduce((sum, r) => sum + (r.total_cost ?? 0), 0)
  const totalParticipants = paid.reduce(
    (sum, r) => sum + ((r.participants as Participant[])?.length ?? 0), 0
  )

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Fetch the Finish Line</h1>
        <p className="text-stone-400 mt-1">Fun Run · June 20, 2026 · Sharbono Park, Fairview MT</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Sign-Ups" value={String(runners.length)} />
        <StatCard label="Paid" value={String(paid.length)} highlight />
        <StatCard label="Participants (Paid)" value={String(totalParticipants)} />
        <StatCard label="Revenue Confirmed" value={`$${totalRevenue.toLocaleString()}`} />
      </div>

      {/* ── Paid Registrations ─────────────────────────────────── */}
      <Section
        title="Paid Registrations"
        count={paid.length}
        badge="green"
        empty="No paid registrations yet."
      >
        {paid.map(reg => (
          <RegistrationCard key={reg.id} reg={reg} />
        ))}
      </Section>

      {/* ── Pending Payment ────────────────────────────────────── */}
      <Section
        title="Pending Payment"
        count={pending.length}
        badge="amber"
        empty="No pending registrations."
        className="mt-10"
      >
        {pending.map(reg => (
          <RegistrationCard key={reg.id} reg={reg} />
        ))}
      </Section>

      {/* ── Event Volunteers ───────────────────────────────────── */}
      <section className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-display text-xl font-bold text-stone-700">Event Volunteers</h2>
          <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2.5 py-1 rounded-full">
            {staffVolunteers.length}
          </span>
        </div>
        {staffVolunteers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center">
            <p className="text-stone-400">No event volunteers yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-100 bg-stone-50">
                <tr>
                  <th className="text-left px-5 py-3 text-stone-500 font-semibold">Name</th>
                  <th className="text-left px-5 py-3 text-stone-500 font-semibold">Email</th>
                  <th className="text-left px-5 py-3 text-stone-500 font-semibold">Phone</th>
                  <th className="text-left px-5 py-3 text-stone-500 font-semibold">Role</th>
                  <th className="text-left px-5 py-3 text-stone-500 font-semibold">Signed Up</th>
                </tr>
              </thead>
              <tbody>
                {staffVolunteers.map((v, i) => (
                  <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                    <td className="px-5 py-3 font-semibold text-stone-800">{v.contact_name}</td>
                    <td className="px-5 py-3 text-stone-500">
                      <a href={`mailto:${v.contact_email}`} className="hover:text-[#D4A017] transition-colors">
                        {v.contact_email}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-stone-500">{v.contact_phone ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {ROLE_LABELS[v.volunteer_role] ?? v.volunteer_role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-400 text-xs">
                      {new Date(v.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function RegistrationCard({ reg }: { reg: Record<string, unknown> }) {
  const participants = (reg.participants as Participant[]) ?? []
  const mailing = reg.mailing_address as MailingAddress

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-800 text-lg">{reg.contact_name as string}</span>
            <span className="bg-stone-100 text-stone-500 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
              {reg.registration_type as string}
            </span>
            {reg.volunteer_role && (
              <span className="bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Runner volunteer: {ROLE_LABELS[reg.volunteer_role as string] ?? reg.volunteer_role as string}
              </span>
            )}
          </div>
          <p className="text-stone-400 text-sm mt-0.5">{reg.contact_email as string}</p>
          {reg.contact_phone && <p className="text-stone-400 text-sm">{reg.contact_phone as string}</p>}
          <p className="text-stone-300 text-xs mt-1">
            {new Date(reg.created_at as string).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="font-bold text-[#D4A017] text-xl">${reg.total_cost as number}</p>
          <PaymentToggle id={reg.id as string} initialPaid={!!(reg.payment_received)} />
        </div>
      </div>

      {/* Participants + T-shirt sizes */}
      <div className="border-t border-stone-100 pt-4 mb-4">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Participants & T-Shirt Sizes</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="text-xs text-stone-400 font-semibold pb-1.5 pr-4">Name</th>
              <th className="text-xs text-stone-400 font-semibold pb-1.5 pr-4">Category</th>
              <th className="text-xs text-stone-400 font-semibold pb-1.5 pr-4">Shirt Size</th>
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

      {/* Liability + Mailing */}
      <div className="flex flex-wrap gap-6 border-t border-stone-100 pt-4">
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Liability Waiver</p>
          <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
            ✓ Accepted
          </p>
        </div>
        {mailing ? (
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Mailing Address</p>
            <p className="text-sm text-stone-700">
              {mailing.street}, {mailing.city}, {mailing.state} {mailing.zip}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Mailing Address</p>
            <p className="text-sm text-stone-400">Not provided</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  count,
  badge,
  empty,
  children,
  className = '',
}: {
  title: string
  count: number
  badge: 'green' | 'amber'
  empty: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display text-xl font-bold text-stone-700">{title}</h2>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          badge === 'green' ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {count}
        </span>
      </div>
      {count === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center">
          <p className="text-stone-400">{empty}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">{children}</div>
      )}
    </section>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-display text-3xl font-bold ${highlight ? 'text-green-600' : 'text-[#2D1606]'}`}>{value}</p>
    </div>
  )
}
