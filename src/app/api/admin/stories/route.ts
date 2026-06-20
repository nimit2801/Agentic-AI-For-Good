import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const supabase = createServerSupabaseClient()

  if (id) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...fields } = body
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('stories')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function POST(req: Request) {
  const body = await req.json()

  // Basic validation
  if (!body.title || !body.slug) {
    return NextResponse.json(
      { error: 'title and slug are required' },
      { status: 400 }
    )
  }

  const supabase = createServerSupabaseClient()

  const storyData = {
    ...body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('stories')
    .insert(storyData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, story: data })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const slug = searchParams.get('slug')

  const supabase = createServerSupabaseClient()

  let query = supabase.from('stories').delete()

  if (id) {
    query = query.eq('id', id)
  } else if (slug) {
    query = query.eq('slug', slug)
  } else {
    return NextResponse.json(
      { error: 'id or slug is required' },
      { status: 400 }
    )
  }

  const { error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
