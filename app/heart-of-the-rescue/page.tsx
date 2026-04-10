import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import ReviewForm from './ReviewForm'

export const metadata = {
  title: 'Heart of the Rescue',
  description: 'Read adoption success stories from families who found their forever pets through Annie Oakley Animal Rescue in Eastern Montana.',
  openGraph: {
    title: 'Heart of the Rescue | Annie Oakley Animal Rescue',
    description: 'Real stories from families who adopted through Annie Oakley Animal Rescue.',
    url: 'https://www.annieoakleyanimalrescue.com/heart-of-the-rescue',
  },
}

// Fetch all submitted reviews to display on the page
async function getReviews() {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function HeartOfTheRescuePage() {
  const reviews = await getReviews()

  return (
    <div className="bg-amber-50 min-h-screen">

      {/* Header */}
      <div className="bg-[#2D1606] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="w-12 h-1 bg-[#D4A017] mb-5 rounded-full" />
          <h1 className="font-display text-5xl font-bold text-[#D4A017] mb-3">
            Heart of the Rescue
          </h1>
          <p className="text-amber-50/80 text-lg max-w-2xl">
            Every animal we rescue carries a piece of our heart — and so do the families who
            give them their forever home. Share your story and your photo below.
            These are the happy endings that keep us going.
          </p>
        </div>
      </div>

      {/* Reviews grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">

        {reviews.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-1 bg-[#D4A017] rounded-full" />
              <h2 className="font-display text-3xl font-bold text-[#2D1606]">
                Stories from Our Community
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-[#2D1606] mb-2">No stories yet — be the first!</p>
            <p className="text-stone-400">Share your rescue story below.</p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-amber-200 mb-16" />

        {/* Submit a review */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-1 bg-[#D4A017] rounded-full" />
            <h2 className="font-display text-3xl font-bold text-[#2D1606]">
              Share Your Story
            </h2>
          </div>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Did you adopt or foster through Annie Oakley Animal Rescue? We'd love to
            hear from you and see your furry family member! Upload a photo and leave
            us a review — it means the world to our team and helps other families
            take that first step.
          </p>

          {/* Client component handles the upload + submit */}
          <ReviewForm />
        </div>
      </div>

    </div>
  )
}

// ── Individual review card ─────────────────────────────────────────
function ReviewCard({ review }: {
  review: {
    id: string
    reviewer_name: string
    animal_name: string
    review_text: string
    photo_url: string | null
    created_at: string
  }
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 hover:shadow-md hover:border-[#D4A017]/30 transition-all flex flex-col">

      {/* Animal photo */}
      <div className="h-52 relative bg-amber-50">
        {review.photo_url ? (
          <Image
            src={review.photo_url}
            alt={review.animal_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">
            No photo
          </div>
        )}
        {/* Animal name badge over photo */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#2D1606]/70 to-transparent px-4 py-3">
          <p className="font-display font-bold text-white text-lg">{review.animal_name}</p>
        </div>
      </div>

      {/* Review text */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Quote mark */}
        <span className="text-[#D4A017] font-display text-4xl leading-none">"</span>
        <p className="text-stone-600 text-sm leading-relaxed -mt-3 flex-1">
          {review.review_text}
        </p>
        <p className="text-[#D4A017] font-semibold text-sm mt-auto">
          — {review.reviewer_name}
        </p>
      </div>
    </div>
  )
}
