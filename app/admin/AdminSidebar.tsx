'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Star, ClipboardList, PawPrint, Users, LogOut } from 'lucide-react'

const NAV = [
  { label: 'Dashboard',    href: '/admin/dashboard',     icon: LayoutDashboard },
  { label: 'Reviews',      href: '/admin/reviews',        icon: Star },
  { label: 'Applications', href: '/admin/applications',   icon: ClipboardList },
  { label: 'Animals',      href: '/admin/animals',        icon: PawPrint },
  { label: 'Volunteers',   href: '/admin/volunteers',     icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 bg-[#2D1606] flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded bg-white p-0.5" />
          <span className="text-[#D4A017] font-display font-bold text-sm leading-tight">
            Admin<br /><span className="text-white/60 font-normal text-xs">Annie Oakley</span>
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? 'bg-[#D4A017] text-[#2D1606]'
                  : 'text-amber-100/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* View site + Logout */}
      <div className="p-3 border-t border-white/10 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-amber-100/50 hover:text-amber-100 transition-colors"
        >
          View Public Site ↗
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-100/70 hover:bg-white/10 hover:text-white transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
