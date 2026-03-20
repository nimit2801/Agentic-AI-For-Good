import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()
  const { data: stories } = await supabase
    .from('stories')
    .select('slug, updated_at')
    .eq('published', true)

  const storyUrls = (stories ?? []).map((s) => ({
    url: `https://agenticaiforgood.com/stories/${s.slug}`,
    lastModified: new Date(s.updated_at),
  }))

  return [
    { url: 'https://agenticaiforgood.com', lastModified: new Date() },
    { url: 'https://agenticaiforgood.com/philosophy', lastModified: new Date() },
    { url: 'https://agenticaiforgood.com/story', lastModified: new Date() },
    { url: 'https://agenticaiforgood.com/stories', lastModified: new Date() },
    ...storyUrls,
  ]
}
