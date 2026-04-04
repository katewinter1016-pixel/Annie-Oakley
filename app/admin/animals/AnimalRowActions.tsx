'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AnimalRowActions({ animalId }: { animalId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this animal? This cannot be undone.')) return
    setLoading(true)
    await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'animals', id: animalId }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link
        href={`/admin/animals/${animalId}/edit`}
        className="text-stone-400 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-700 transition-colors"
      >
        Edit
      </Link>
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
