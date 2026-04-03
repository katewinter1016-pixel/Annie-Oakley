import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import ConditionalShell from '@/components/ConditionalShell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  title: 'Annie Oakley Animal Rescue',
  description: 'Saving lives one paw at a time — nonprofit animal rescue in Eastern Montana.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-amber-50 text-stone-800 min-h-screen flex flex-col">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  )
}
