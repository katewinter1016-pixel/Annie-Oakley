import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-[#1a1a1a] border-b border-[#D4A017]/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo — clicking this always takes you back to the homepage */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Annie Oakley Animal Rescue"
            width={56}
            height={56}
            className="rounded-full bg-white p-1"
          />
          <span className="text-[#D4A017] font-bold text-lg leading-tight hidden sm:block">
            Annie Oakley<br />
            <span className="text-white font-normal text-sm">Animal Rescue</span>
          </span>
        </Link>

        {/* Navigation links */}
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
          <Link href="/surrender" className="text-gray-300 hover:text-[#D4A017] transition-colors">
            Surrender
          </Link>
          {/* The donate button is yellow so it jumps out at visitors */}
          <Link
            href="/#donate"
            className="bg-[#D4A017] text-[#1a1a1a] px-4 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors"
          >
            Donate
          </Link>
        </div>
      </div>
    </nav>
  )
}
