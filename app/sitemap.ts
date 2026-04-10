import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.annieoakleyanimalrescue.com'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/animals`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/adopt`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/foster`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/volunteer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/heart-of-the-rescue`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/forms`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/surrender`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
