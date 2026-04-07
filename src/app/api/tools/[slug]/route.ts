import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('approved', true)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ tool: data })
}
