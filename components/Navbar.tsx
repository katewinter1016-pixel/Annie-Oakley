'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Adopt', href: '/adopt' },
  { label: 'Foster', href: '/foster' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Heart of the Rescue', href: '/heart-of-the-rescue' },
  { label: 'Forms', href: '/forms' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="Annie Oakley Animal Rescue"
            width={52}
            height={52}
            className="rounded bg-white p-0.5 border border-amber-100"
          />
          <span className="font-display font-bold text-lg leading-tight text-[#2D1606] hidden sm:block">
            Annie Oakley<br />
            <span className="text-[#D4A017] font-semibold text-sm">Animal Rescue</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors whitespace-nowrap ${
                pathname === href ? 'text-[#D4A017]' : 'text-stone-600 hover:text-[#D4A017]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-amber-50 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden border-t border-amber-100 bg-white px-4 py-3 flex flex-col gap-1">
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                pathname === href
                  ? 'bg-[#D4A017]/10 text-[#D4A017]'
                  : 'text-stone-600 hover:bg-amber-50 hover:text-[#2D1606]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
