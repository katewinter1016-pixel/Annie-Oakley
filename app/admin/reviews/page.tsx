import { supabaseServer as supabase } from '@/lib/supabaseServer'
import Image from 'next/image'
import Link from 'next/link'
import ReviewActions from './ReviewActions'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

async function getReviews(page: number) {
  const offset = (page - 1) * PAGE_SIZE

  const { data: pending } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false })

  const { data: approved, count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  return {
    pending: pending ?? [],
    approved: approved ?? [],
    approvedTotal: count ?? 0,
  }
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const { pending, approved, approvedTotal } = await getReviews(page)
  const totalPages = Math.ceil(approvedTotal / PAGE_SIZE)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Reviews</h1>
        <p className="text-stone-400 mt-1">
          Approve reviews before they appear on the Heart of the Rescue page.
        </p>
      </div>

      {/* Pending reviews */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-display text-xl font-bold text-stone-700">Awaiting Approval</h2>
          {pending.length > 0 && (
            <span className="bg-[#D4A017] text-[#2D1606] text-xs font-bold px-2.5 py-1 rounded-full">
              {pending.length}
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
            <p className="text-stone-400">No reviews pending — you're all caught up!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* Approved reviews */}
      <section>
        <h2 className="font-display text-xl font-bold text-stone-700 mb-5">
          Approved & Live ({approvedTotal})
        </h2>

        {approved.length === 0 ? (
          <p className="text-stone-400 text-sm">No approved reviews yet.</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {approved.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} basePath="/admin/reviews" />
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

function ReviewCard({ review }: {
  review: {
    id: string
    reviewer_name: string
    animal_name: string
    review_text: string
    photo_url: string | null
    approved: boolean
    created_at: string
  }
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col sm:flex-row ${
      review.approved ? 'border-green-100' : 'border-[#D4A017]/40'
    }`}>

      {/* Photo */}
      <div className="sm:w-40 sm:flex-shrink-0 h-40 sm:h-auto relative bg-amber-50">
        {review.photo_url ? (
          <Image src={review.photo_url} alt={review.animal_name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">
            No photo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-bold text-stone-800">{review.animal_name}</span>
              <span className="text-stone-400 text-sm"> · by {review.reviewer_name}</span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              review.approved
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {review.approved ? '✓ Live' : 'Pending'}
            </span>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mt-1">
            "{review.review_text}"
          </p>
          <p className="text-stone-300 text-xs">
            Submitted {new Date(review.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })}
          </p>
        </div>

        <ReviewActions reviewId={review.id} approved={review.approved} />
      </div>
    </div>
  )
}
