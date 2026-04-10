import { supabaseServer as supabase } from '@/lib/supabaseServer'
import Link from 'next/link'
import ApplicationActions from './ApplicationActions'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

async function getApplications(page: number) {
  const offset = (page - 1) * PAGE_SIZE

  const { data: pending } = await supabase
    .from('applications')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const { data: reviewed, count } = await supabase
    .from('applications')
    .select('*', { count: 'exact' })
    .neq('status', 'pending')
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  return {
    pending: pending ?? [],
    reviewed: reviewed ?? [],
    reviewedTotal: count ?? 0,
  }
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const { pending, reviewed, reviewedTotal } = await getApplications(page)
  const totalPages = Math.ceil(reviewedTotal / PAGE_SIZE)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Applications</h1>
        <p className="text-stone-400 mt-1">Review adoption, foster, and surrender applications.</p>
      </div>

      {/* Pending */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-display text-xl font-bold text-stone-700">Pending</h2>
          {pending.length > 0 && (
            <span className="bg-[#D4A017] text-[#2D1606] text-xs font-bold px-2.5 py-1 rounded-full">
              {pending.length}
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
            <p className="text-stone-400">No pending applications.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>

      {/* Reviewed */}
      <section>
        <h2 className="font-display text-xl font-bold text-stone-700 mb-5">
          Reviewed ({reviewedTotal})
        </h2>
        {reviewed.length === 0 ? (
          <p className="text-stone-400 text-sm">No reviewed applications yet.</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {reviewed.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} basePath="/admin/applications" />
          </>
        )}
      </section>
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

function ApplicationCard({ app }: { app: Record<string, unknown> }) {
  const id = app.id as string
  const applicantName = app.applicant_name as string
  const type = app.type as string
  const status = app.status as string
  const animalId = app.animal_id as string | null
  const createdAt = app.created_at as string
  const formData = app.form_data as Record<string, string> | null

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-green-50 text-green-600 border border-green-200',
    rejected: 'bg-red-50 text-red-500 border border-red-200',
  }

  const typeLabel: Record<string, string> = {
    adoption: 'Adoption',
    foster: 'Foster',
    surrender: 'Surrender',
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-800 text-lg">{applicantName}</span>
            <span className="bg-stone-100 text-stone-500 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {typeLabel[type] ?? type}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${statusStyles[status] ?? statusStyles.pending}`}>
              {status}
            </span>
          </div>
          {animalId && (
            <p className="text-stone-400 text-sm mt-0.5">Animal ID: {animalId}</p>
          )}
          <p className="text-stone-300 text-xs mt-1">
            Submitted {new Date(createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })}
          </p>
        </div>
        <ApplicationActions applicationId={id} status={status} />
      </div>

      {formData && (
        <details className="group">
          <summary className="cursor-pointer text-xs font-semibold text-stone-400 hover:text-stone-600 transition-colors select-none">
            View application details ▾
          </summary>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 border-t border-stone-100 pt-3">
            {Object.entries(formData).map(([key, val]) => (
              <div key={key}>
                <p className="text-xs text-stone-400 capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-sm text-stone-700">{String(val)}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
