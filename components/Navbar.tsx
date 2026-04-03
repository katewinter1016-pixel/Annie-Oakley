import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-[#1a1a1a] border-b border-[#D4A017]/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo — square, no border radius */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Annie Oakley Animal Rescue"
            width={56}
            height={56}
            className="bg-white p-1 rounded"
          />
          <span className="text-[#D4A017] font-bold text-lg leading-tight hidden sm:block">
            Annie Oakley<br />
            <span className="text-white font-normal text-sm">Animal Rescue</span>
          </span>
        </Link>

        {/* Navigation links — Surrender removed, Forms added, Donate button removed */}
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/animals" className="text-gray-300 hover:text-[#D4A017] transition-colors">
            Animals
          </Link>
          <Link href="/adopt" className="text-gray-300 hover:text-[#D4A017] transition-colors">
            Adopt
          </Link>
          <Link href="/foster" className="text-gray-300 hover:text-[#D4A017] transition-colors">
            Foster
          </Link>
          <Link href="/volunteer" className="text-gray-300 hover:text-[#D4A017] transition-colors">
            Volunteer
          </Link>
          <Link href="/forms" className="text-gray-300 hover:text-[#D4A017] transition-colors">
            Forms
          </Link>
        </div>
      </div>
    </nav>
  )
}
