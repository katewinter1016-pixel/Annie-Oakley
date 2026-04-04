'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewActions({ reviewId, approved }: { reviewId: string; approved: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleApprove() {
    setLoading(true)
    await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'reviews', id: reviewId, data: { approved: true } }),
    })
    router.refresh()
    setLoading(false)
  }

  async function handleUnapprove() {
    setLoading(true)
    await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'reviews', id: reviewId, data: { approved: false } }),
    })
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this review? This cannot be undone.')) return
    setLoading(true)
    await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'reviews', id: reviewId }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!approved ? (
        <button
          onClick={handleApprove}
          disabled={loading}
          className="bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          Approve
        </button>
      ) : (
        <button
          onClick={handleUnapprove}
          disabled={loading}
          className="bg-stone-200 text-stone-600 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-stone-300 transition-colors disabled:opacity-50"
        >
          Unpublish
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-400 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  )
}
