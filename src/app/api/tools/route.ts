import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  const category = searchParams.get('category')
  const tags = searchParams.get('tags')

  const supabase = createServerSupabaseClient()
  let query = supabase
    .from('tools')
    .select('*', { count: 'exact' })
    .eq('approved', true)
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (tags) {
    const tagArray = tags.split(',').map((t) => t.trim())
    query = query.contains('tags', tagArray)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tools: data, total: count })
}
