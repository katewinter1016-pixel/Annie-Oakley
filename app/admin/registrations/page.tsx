import type { ReactNode } from 'react'
import { getSupabaseServer } from '@/lib/supabaseServer'
import RegistrationCard from './RegistrationCard'

export const dynamic = 'force-dynamic'

type Participant = { name: string; age_category: string; shirt_size: string; price: number }

const ROLE_LABELS: Record<string, string> = {
  'sign-in-booth': 'Sign-In Booth',
  'post-run-booth': 'Post Run Booth',
  'race-setup': 'Race Set-Up',
  'alternate-volunteer': 'Alternate',
}

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

export default async function AdminRegistrationsPage() {
  const { runners, staffVolunteers } = await getData()

  const registered = runners.filter(r => r.payment_received)
  const pending = runners.filter(r => !r.payment_received)

  const totalRevenue = registered.reduce((sum, r) => sum + (r.total_cost ?? 0), 0)
  const totalParticipants = registered.reduce(
    (sum, r) => sum + ((r.participants as Participant[])?.length ?? 0), 0
  )

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Fetch the Finish Line</h1>
        <p className="text-stone-400 mt-1">Fun Run · June 20, 2026 · Sharbono Park, Fairview MT</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Sign-Ups" value={String(runners.length)} />
        <StatCard label="Registered (Paid)" value={String(registered.length)} highlight />
        <StatCard label="Participants (Paid)" value={String(totalParticipants)} />
        <StatCard label="Revenue Confirmed" value={`$${totalRevenue.toLocaleString()}`} />
      </div>

      {/* ── Pending Payment ────────────────────────────────────── */}
      <Section
        title="Pending Payment"
        count={pending.length}
        badge="amber"
        empty="No pending registrations."
      >
        {pending.map(reg => (
          <RegistrationCard key={reg.id} reg={reg} />
        ))}
      </Section>

      {/* ── Registered (Paid) ──────────────────────────────────── */}
      <Section
        title="Registered"
        count={registered.length}
        badge="green"
        empty="No paid registrations yet."
        className="mt-10"
      >
        {registered.map(reg => (
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

function Section({
  title, count, badge, empty, children, className = '',
}: {
  title: string; count: number; badge: 'green' | 'amber'; empty: string; children: ReactNode; className?: string
}) {
  return (
    <section className={className}>
      <div className="flex items-center gap-3 mb-4">
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
        <div className="flex flex-col gap-2">{children}</div>
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
