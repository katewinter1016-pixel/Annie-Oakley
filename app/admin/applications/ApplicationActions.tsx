'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplicationActions({ applicationId, status }: { applicationId: string; status: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function setStatus(newStatus: string) {
    setLoading(true)
    await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'applications', id: applicationId, data: { status: newStatus } }),
    })
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this application permanently?')) return
    setLoading(true)
    await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'applications', id: applicationId }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {status !== 'approved' && (
        <button
          onClick={() => setStatus('approved')}
          disabled={loading}
          className="bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          Approve
        </button>
      )}
      {status !== 'rejected' && (
        <button
          onClick={() => setStatus('rejected')}
          disabled={loading}
          className="bg-stone-200 text-stone-600 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-stone-300 transition-colors disabled:opacity-50"
        >
          Reject
        </button>
      )}
      {status === 'pending' && (
        <button
          onClick={() => setStatus('pending')}
          disabled={true}
          className="hidden"
        />
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
