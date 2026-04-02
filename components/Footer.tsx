import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#D4A017]/20 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Branding column */}
        <div className="flex flex-col gap-3">
          <Image
            src="/logo.png"
            alt="Annie Oakley Animal Rescue"
            width={72}
            height={72}
            className="rounded-full bg-white p-1"
          />
          <p className="text-gray-400 text-sm leading-relaxed">
            A nonprofit animal rescue located in Eastern Montana. Rescuing animals in life or death situations and helping control the stray population.
          </p>
        </div>

        {/* Quick links column */}
        <div>
          <h3 className="text-[#D4A017] font-semibold mb-3">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><Link href="/animals" className="hover:text-[#D4A017] transition-colors">Adoptable Animals</Link></li>
            <li><Link href="/adopt" className="hover:text-[#D4A017] transition-colors">Adoption Application</Link></li>
            <li><Link href="/foster" className="hover:text-[#D4A017] transition-colors">Foster Application</Link></li>
            <li><Link href="/volunteer" className="hover:text-[#D4A017] transition-colors">Volunteer</Link></li>
            <li><Link href="/surrender" className="hover:text-[#D4A017] transition-colors">Surrender an Animal</Link></li>
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <h3 className="text-[#D4A017] font-semibold mb-3">Contact Us</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
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
            <li className="text-gray-500 text-xs mt-2">Eastern Montana</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-600">
        © {new Date().getFullYear()} Annie Oakley Animal Rescue · Nonprofit Organization
      </div>
    </footer>
  )
}
