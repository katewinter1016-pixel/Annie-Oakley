import { supabaseServer as supabase } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

async function getRegistrations(page: number) {
  const offset = (page - 1) * PAGE_SIZE
  const { data, count } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact' })
    .eq('event_id', '5k-2026')
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)
  return { registrations: data ?? [], total: count ?? 0 }
}

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const { registrations, total } = await getRegistrations(page)

  type Participant = { name: string; age_category: string; shirt_size: string; price: number }

  const totalRevenue = registrations.reduce((sum, r) => sum + (r.total_cost ?? 0), 0)
  const totalParticipants = registrations.reduce(
    (sum, r) => sum + ((r.participants as Participant[])?.length ?? 0), 0
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">5K Registrations</h1>
        <p className="text-stone-400 mt-1">Fetch the Finish Line 5K · June 20, 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Registrations" value={String(total)} />
        <StatCard label="Total Participants" value={String(totalParticipants)} />
        <StatCard label="Revenue Expected" value={`$${totalRevenue.toLocaleString()}`} />
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
          <p className="text-stone-400">No registrations yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {registrations.map((reg) => {
            const participants = reg.participants as Participant[]
            return (
              <div key={reg.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-800 text-lg">{reg.contact_name}</span>
                      <span className="bg-stone-100 text-stone-500 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                        {reg.registration_type}
                      </span>
                    </div>
                    <p className="text-stone-400 text-sm mt-0.5">{reg.contact_email}</p>
                    {reg.contact_phone && <p className="text-stone-400 text-sm">{reg.contact_phone}</p>}
                    <p className="text-stone-300 text-xs mt-1">
                      {new Date(reg.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#D4A017] text-xl">${reg.total_cost}</p>
                    <p className="text-stone-400 text-xs">{participants.length} participant{participants.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="text-xs text-stone-400 font-semibold pb-2 pr-4">Name</th>
                        <th className="text-xs text-stone-400 font-semibold pb-2 pr-4">Category</th>
                        <th className="text-xs text-stone-400 font-semibold pb-2 pr-4">Shirt Size</th>
                        <th className="text-xs text-stone-400 font-semibold pb-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, i) => (
                        <tr key={i}>
                          <td className="text-stone-700 pr-4 pb-1">{p.name}</td>
                          <td className="text-stone-500 pr-4 pb-1 capitalize">{p.age_category}</td>
                          <td className="text-stone-500 pr-4 pb-1">{p.shirt_size || '—'}</td>
                          <td className="text-stone-500 pb-1">${p.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
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
