import { supabaseServer as supabase } from '@/lib/supabaseServer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

async function getVolunteers(page: number) {
  const offset = (page - 1) * PAGE_SIZE
  const { data, count } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)
  return { volunteers: data ?? [], total: count ?? 0 }
}

export default async function AdminVolunteersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const { volunteers, total } = await getVolunteers(page)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Volunteers</h1>
        <p className="text-stone-400 mt-1">
          {total} volunteer{total !== 1 ? 's' : ''} signed up.
        </p>
      </div>

      {volunteers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
          <p className="text-stone-400">No volunteers yet.</p>
        </div>
      ) : (
        <>
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
          <Pagination page={page} totalPages={totalPages} basePath="/admin/volunteers" />
        </>
      )}
    </div>
  )
}

function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between mt-6">
      {page > 1 ? (
        <Link
          href={`${basePath}?page=${page - 1}`}
          className="text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors px-4 py-2 rounded-full hover:bg-stone-100"
        >
          ← Previous
        </Link>
      ) : (
        <span className="text-sm text-stone-300 px-4 py-2">← Previous</span>
      )}
      <span className="text-sm text-stone-400">Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link
          href={`${basePath}?page=${page + 1}`}
          className="text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors px-4 py-2 rounded-full hover:bg-stone-100"
        >
          Next →
        </Link>
      ) : (
        <span className="text-sm text-stone-300 px-4 py-2">Next →</span>
      )}
    </div>
  )
}
