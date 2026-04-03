import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3">
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

        {/* New nav order: Adopt, Foster, Volunteer, Heart of the Rescue, Forms */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          <Link href="/adopt" className="text-stone-600 hover:text-[#D4A017] transition-colors">
            Adopt
          </Link>
          <Link href="/foster" className="text-stone-600 hover:text-[#D4A017] transition-colors">
            Foster
          </Link>
          <Link href="/volunteer" className="text-stone-600 hover:text-[#D4A017] transition-colors">
            Volunteer
          </Link>
          <Link href="/heart-of-the-rescue" className="text-stone-600 hover:text-[#D4A017] transition-colors whitespace-nowrap">
            Heart of the Rescue
          </Link>
          <Link href="/forms" className="text-stone-600 hover:text-[#D4A017] transition-colors">
            Forms
          </Link>
        </div>
      </div>
    </nav>
  )
}
