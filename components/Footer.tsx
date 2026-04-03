import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#2D1606] text-amber-100">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Branding */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg p-2 w-fit">
            <Image
              src="/logo.png"
              alt="Annie Oakley Animal Rescue"
              width={72}
              height={72}
              className="rounded"
            />
          </div>
          <p className="text-amber-200/70 text-sm leading-relaxed">
            A nonprofit rescue in Eastern Montana — saving animals in life or death situations,
            one life at a time since August 2024.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-[#D4A017] font-display font-bold text-lg mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm text-amber-200/80">
            <li><Link href="/animals" className="hover:text-[#D4A017] transition-colors">Adoptable Animals</Link></li>
            <li><Link href="/adopt" className="hover:text-[#D4A017] transition-colors">Adoption Application</Link></li>
            <li><Link href="/foster" className="hover:text-[#D4A017] transition-colors">Foster Application</Link></li>
            <li><Link href="/surrender" className="hover:text-[#D4A017] transition-colors">Surrender an Animal</Link></li>
            <li><Link href="/volunteer" className="hover:text-[#D4A017] transition-colors">Volunteer</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[#D4A017] font-display font-bold text-lg mb-4">Contact Us</h3>
          <ul className="flex flex-col gap-3 text-sm text-amber-200/80">
            <li>
              <a href="tel:4064890382" className="hover:text-[#D4A017] transition-colors">
                (406) 489-0382
              </a>
            </li>
            <li>
              <a href="mailto:annieoakleyanimalrescue@gmail.com" className="hover:text-[#D4A017] transition-colors break-all">
                annieoakleyanimalrescue@gmail.com
              </a>
            </li>
            <li className="text-amber-200/40 text-xs mt-1">Eastern Montana</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-amber-900 text-center py-4 text-xs text-amber-200/30">
        © {new Date().getFullYear()} Annie Oakley Animal Rescue · Nonprofit Organization
      </div>
    </footer>
  )
}
