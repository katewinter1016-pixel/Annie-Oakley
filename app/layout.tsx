import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import ConditionalShell from '@/components/ConditionalShell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Annie Oakley Animal Rescue | Eastern Montana',
    template: '%s | Annie Oakley Animal Rescue',
  },
  description: 'Annie Oakley Animal Rescue is a nonprofit saving dogs, cats, and other animals in Eastern Montana. Adopt, foster, or volunteer today.',
  keywords: ['animal rescue', 'dog adoption', 'cat adoption', 'Eastern Montana', 'Miles City', 'nonprofit rescue', 'foster animals', 'Montana pets'],
  metadataBase: new URL('https://www.annieoakleyanimalrescue.com'),
  openGraph: {
    type: 'website',
    siteName: 'Annie Oakley Animal Rescue',
    title: 'Annie Oakley Animal Rescue | Eastern Montana',
    description: 'Saving dogs, cats, and other animals in Eastern Montana. Adopt, foster, or volunteer with us.',
    url: 'https://www.annieoakleyanimalrescue.com',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Annie Oakley Animal Rescue' }],
  },
  twitter: {
    card: 'summary',
    title: 'Annie Oakley Animal Rescue | Eastern Montana',
    description: 'Saving dogs, cats, and other animals in Eastern Montana. Adopt, foster, or volunteer with us.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.annieoakleyanimalrescue.com',
  },
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
