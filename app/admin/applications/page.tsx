import { supabase } from '@/lib/supabase'
import ApplicationActions from './ApplicationActions'

async function getApplications() {
  const { data } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminApplicationsPage() {
  const applications = await getApplications()

  const pending = applications.filter((a) => a.status === 'pending')
  const reviewed = applications.filter((a) => a.status !== 'pending')

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
          Reviewed ({reviewed.length})
        </h2>
        {reviewed.length === 0 ? (
          <p className="text-stone-400 text-sm">No reviewed applications yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviewed.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>
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

      {/* Form data details */}
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
