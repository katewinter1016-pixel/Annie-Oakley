import { supabaseServer as supabase } from '@/lib/supabaseServer'

async function getVolunteers() {
  const { data } = await supabase
    .from('volunteers')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminVolunteersPage() {
  const volunteers = await getVolunteers()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Volunteers</h1>
        <p className="text-stone-400 mt-1">
          {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''} signed up.
        </p>
      </div>

      {volunteers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
          <p className="text-stone-400">No volunteers yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                <th className="text-left px-5 py-3 text-stone-500 font-semibold">Name</th>
                <th className="text-left px-5 py-3 text-stone-500 font-semibold">Email</th>
                <th className="text-left px-5 py-3 text-stone-500 font-semibold">Phone</th>
                <th className="text-left px-5 py-3 text-stone-500 font-semibold">Interests</th>
                <th className="text-left px-5 py-3 text-stone-500 font-semibold">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v, i) => (
                <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="px-5 py-3 font-semibold text-stone-800">{v.name}</td>
                  <td className="px-5 py-3 text-stone-500">
                    <a href={`mailto:${v.email}`} className="hover:text-[#D4A017] transition-colors">
                      {v.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-stone-500">{v.phone ?? '—'}</td>
                  <td className="px-5 py-3 text-stone-500">{v.interests ?? '—'}</td>
                  <td className="px-5 py-3 text-stone-400 text-xs">
                    {new Date(v.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
