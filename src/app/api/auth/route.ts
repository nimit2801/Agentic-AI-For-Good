import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return NextResponse.json({ error: error.message }, { status: 401 })
  return NextResponse.json({ user: data.user })
}

export async function DELETE() {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
