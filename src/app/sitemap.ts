import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()

  const [{ data: stories }, { data: tools }] = await Promise.all([
    supabase.from('stories').select('slug, updated_at').eq('published', true),
    supabase.from('tools').select('slug, updated_at').eq('approved', true),
  ])

  const storyUrls = (stories ?? []).map((s) => ({
    url: `https://agenticaiforgood.com/stories/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const toolUrls = (tools ?? []).map((t) => ({
    url: `https://agenticaiforgood.com/tools/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://agenticaiforgood.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://agenticaiforgood.com/tools', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://agenticaiforgood.com/mcp', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://agenticaiforgood.com/how-it-works', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://agenticaiforgood.com/stories', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://agenticaiforgood.com/philosophy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://agenticaiforgood.com/story', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    ...toolUrls,
    ...storyUrls,
  ]
}
