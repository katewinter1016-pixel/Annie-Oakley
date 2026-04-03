import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Star, ClipboardList, PawPrint, Users } from 'lucide-react'

async function getStats() {
  const [reviews, applications, animals, volunteers] = await Promise.all([
    supabase.from('reviews').select('id, approved').eq('approved', false),
    supabase.from('applications').select('id, status').eq('status', 'pending'),
    supabase.from('animals').select('id').eq('status', 'available'),
    supabase.from('volunteers').select('id'),
  ])
  return {
    pendingReviews: reviews.data?.length ?? 0,
    pendingApplications: applications.data?.length ?? 0,
    availableAnimals: animals.data?.length ?? 0,
    totalVolunteers: volunteers.data?.length ?? 0,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-stone-400 mt-1">Welcome back. Here's what needs your attention.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          label="Pending Reviews"
          value={stats.pendingReviews}
          icon={Star}
          href="/admin/reviews"
          urgent={stats.pendingReviews > 0}
        />
        <StatCard
          label="Pending Applications"
          value={stats.pendingApplications}
          icon={ClipboardList}
          href="/admin/applications"
          urgent={stats.pendingApplications > 0}
        />
        <StatCard
          label="Available Animals"
          value={stats.availableAnimals}
          icon={PawPrint}
          href="/admin/animals"
        />
        <StatCard
          label="Volunteers"
          value={stats.totalVolunteers}
          icon={Users}
          href="/admin/volunteers"
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-xl font-bold text-stone-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/animals/new" className="bg-[#D4A017] text-[#2D1606] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors">
            + Add New Animal
          </Link>
          <Link href="/admin/reviews" className="bg-[#2D1606] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-amber-900 transition-colors">
            Review Submissions
          </Link>
          <Link href="/admin/applications" className="border-2 border-stone-200 text-stone-600 px-5 py-2.5 rounded-full font-bold text-sm hover:border-[#D4A017] transition-colors">
            View Applications
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, href, urgent }: {
  label: string; value: number; icon: React.ElementType; href: string; urgent?: boolean
}) {
  return (
    <Link
      href={href}
      className={`bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm border transition-all hover:shadow-md group ${
        urgent ? 'border-[#D4A017]' : 'border-stone-100 hover:border-[#D4A017]/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${urgent ? 'bg-[#D4A017]/15' : 'bg-stone-100'}`}>
          <Icon className={`w-5 h-5 ${urgent ? 'text-[#D4A017]' : 'text-stone-400'}`} />
        </div>
        {urgent && (
          <span className="bg-[#D4A017] text-[#2D1606] text-xs font-bold px-2 py-0.5 rounded-full">
            Needs attention
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-stone-800">{value}</p>
        <p className="text-stone-400 text-sm mt-0.5">{label}</p>
      </div>
    </Link>
  )
}
