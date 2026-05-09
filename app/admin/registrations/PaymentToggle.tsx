'use client'

import { useState } from 'react'
import { CheckCircle2, Clock } from 'lucide-react'

export default function PaymentToggle({
  id,
  initialPaid,
}: {
  id: string
  initialPaid: boolean
}) {
  const [paid, setPaid] = useState(initialPaid)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const next = !paid
    const res = await fetch('/api/admin/5k-payment', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, payment_received: next }),
    })
    if (res.ok) setPaid(next)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${
        paid
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
      }`}
    >
      {paid
        ? <><CheckCircle2 className="w-3.5 h-3.5" /> Paid</>
        : <><Clock className="w-3.5 h-3.5" /> Pending Payment</>
      }
    </button>
  )
}
