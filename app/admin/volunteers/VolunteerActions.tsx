'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VolunteerActions({ id, contacted }: { id: string; contacted: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggleContacted() {
    setLoading(true)
    await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'volunteers', id, data: { contacted: !contacted } }),
    })
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this volunteer permanently?')) return
    setLoading(true)
    await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'volunteers', id }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleContacted}
        disabled={loading}
        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
          contacted
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
        }`}
      >
        {loading ? '…' : contacted ? 'Contacted ✓' : 'Mark Contacted'}
      </button>
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
