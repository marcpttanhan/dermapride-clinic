import type { MetadataRoute } from 'next'
import { getAllProcedureSlugs } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dermaprideclinics.com'
  const slugs   = await getAllProcedureSlugs()

  const procedureUrls = slugs.map(slug => ({
    url:          `${siteUrl}/procedures/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority:     0.7,
  }))

  return [
    {
      url:          siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority:     1.0,
    },
    ...procedureUrls,
  ]
}
