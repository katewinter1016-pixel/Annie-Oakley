import type { ReactNode } from 'react'
import { getSupabaseServer } from '@/lib/supabaseServer'
import RegistrationCard from './RegistrationCard'

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  tshirt: 'T-Shirt',
  hat: 'Hat',
  individual: 'Individual',
  group: 'Group',
  donate: 'Donation',
}

async function getData() {
  const { data } = await getSupabaseServer()
    .from('event_registrations')
    .select('*')
    .eq('event_id', '5k-2026')
    .in('registration_type', ['individual', 'group', 'tshirt', 'hat', 'donate'])
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminRegistrationsPage() {
  const registrations = await getData()

  const tshirts = registrations.filter(r => r.registration_type === 'tshirt')
  const hats = registrations.filter(r => r.registration_type === 'hat')
  const other = registrations.filter(r => !['tshirt', 'hat'].includes(r.registration_type))

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Fetch the Finish Line</h1>
        <p className="text-stone-400 mt-1">Virtual 5K · Starting June 1, 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="T-Shirt Registrations" value={String(tshirts.length)} />
        <StatCard label="Hat Registrations" value={String(hats.length)} />
        <StatCard label="Total Registered" value={String(registrations.length)} />
      </div>

      {/* T-Shirt Registrations */}
      <Section title="T-Shirt Registrations" count={tshirts.length} empty="No T-shirt registrations yet.">
        {tshirts.map(reg => <RegistrationCard key={reg.id} reg={reg} />)}
      </Section>

      {/* Hat Registrations */}
      <Section title="Hat Registrations" count={hats.length} empty="No hat registrations yet." className="mt-10">
        {hats.map(reg => <RegistrationCard key={reg.id} reg={reg} />)}
      </Section>

      {/* Other */}
      {other.length > 0 && (
        <Section title="Other Registrations" count={other.length} empty="" className="mt-10">
          {other.map(reg => <RegistrationCard key={reg.id} reg={reg} />)}
        </Section>
      )}

      <p className="text-stone-300 text-xs mt-8">
        Type labels: {Object.entries(TYPE_LABELS).map(([k,v]) => `${k}=${v}`).join(' · ')}
      </p>
    </div>
  )
}

function Section({
  title, count, empty, children, className = '',
}: {
  title: string; count: number; empty: string; children: ReactNode; className?: string
}) {
  return (
    <section className={className}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display text-xl font-bold text-stone-700">{title}</h2>
        <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2.5 py-1 rounded-full">{count}</span>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="font-display text-3xl font-bold text-[#2D1606]">{value}</p>
    </div>
  )
}
