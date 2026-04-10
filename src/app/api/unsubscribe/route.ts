import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .is('unsubscribed_at', null) // idempotent — only update if not already unsubscribed

  if (error) {
    console.error('[unsubscribe] DB error:', error.message)
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }

  redirect('/unsubscribed')
}
