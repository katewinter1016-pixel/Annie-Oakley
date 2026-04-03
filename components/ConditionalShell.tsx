'use client'

// This component checks the current URL path.
// If we're on an admin page, it renders just the children (no navbar/footer).
// On all other pages, it wraps content with the public Navbar and Footer.
// This lets the admin dashboard have its own completely separate look.

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
