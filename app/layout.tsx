import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Annie Oakley Animal Rescue',
  description: 'Saving lives one paw at a time — nonprofit animal rescue in Eastern Montana.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1a1a1a] text-white min-h-screen flex flex-col`}>
        <Navbar />
        {/* "flex-1" makes the page content stretch to fill available space
            so the footer always stays at the bottom */}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
