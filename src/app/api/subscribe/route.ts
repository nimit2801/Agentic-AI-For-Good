import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, source = 'website' } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('subscribers')
    .insert({ email, source })

  if (error?.code === '23505') {
    return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Subscribed successfully' })
}
