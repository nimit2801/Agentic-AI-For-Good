import { createServerSupabaseClient } from '@/lib/supabase-server'
import ToolDetail from '@/views/ToolDetail'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServerSupabaseClient()
  const { data: tool } = await supabase
    .from('tools')
    .select('name, description, logo_url, tagline')
    .eq('slug', slug)
    .eq('approved', true)
    .single()

  if (!tool) return { title: 'Tool Not Found' }

  return {
    title: `${tool.name} | Agentic AI For Good`,
    description: tool.tagline ?? tool.description,
    openGraph: {
      title: tool.name,
      description: tool.tagline ?? tool.description,
      images: tool.logo_url ? [tool.logo_url] : [],
    },
  }
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = createServerSupabaseClient()
  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('approved', true)
    .single()

  if (!tool) notFound()

  return <ToolDetail tool={tool} />
}
