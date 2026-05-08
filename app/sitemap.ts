// Dynamic sitemap — includes all published doctor portfolios for SEO
import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { APP_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: doctors } = await supabase
    .from('doctors')
    .select('slug, created_at')

  const doctorUrls: MetadataRoute.Sitemap = (doctors ?? []).map((d) => ({
    url: `${APP_URL}/dr/${d.slug}`,
    lastModified: d.created_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${APP_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...doctorUrls,
  ]
}
