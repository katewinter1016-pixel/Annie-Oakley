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
          <a href="https://www.facebook.com/profile.php?id=61564323554302" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[#D4A017] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
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
          <a
            href="https://www.facebook.com/profile.php?id=61564323554302"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-3 rounded-xl text-sm font-semibold text-stone-600 hover:bg-amber-50 hover:text-[#2D1606] transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            Facebook
          </a>
        </div>
      )}
    </nav>
  )
}
