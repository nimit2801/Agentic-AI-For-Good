import { createServerSupabaseClient } from '@/lib/supabase-server'
import StoryDetail from '@/views/StoryDetail'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServerSupabaseClient()
  const { data: story } = await supabase
    .from('stories')
    .select('title, description, image_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!story) return { title: 'Story Not Found' }

  return {
    title: `${story.title} | Agentic AI For Good`,
    description: story.description ?? undefined,
    openGraph: {
      title: story.title,
      description: story.description ?? undefined,
      images: story.image_url ? [story.image_url] : [],
      url: `https://agenticaiforgood.com/stories/${slug}`,
    },
  }
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = createServerSupabaseClient()
  const { data: story } = await supabase
    .from('stories')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!story) notFound()

  return <StoryDetail story={story} />
}
