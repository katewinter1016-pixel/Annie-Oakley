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
            <li><a href="https://rusticrevivalclothingco.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A017] transition-colors">Shop Apparel</a></li>
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
              <a href="tel:4064780042" className="hover:text-[#D4A017] transition-colors">
                (406) 478-0042
              </a>
            </li>
            <li>
              <a href="mailto:annieoakleyanimalrescue@gmail.com" className="hover:text-[#D4A017] transition-colors break-all">
                annieoakleyanimalrescue@gmail.com
              </a>
            </li>
            <li>
              <a href="https://venmo.com/CareMt24" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A017] transition-colors">
                Donate via Venmo @CareMt24
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/profile.php?id=61564323554302" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#D4A017] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/annie_oakley_animal_rescue/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#D4A017] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
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
