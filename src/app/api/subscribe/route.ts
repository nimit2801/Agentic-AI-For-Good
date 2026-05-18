import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { sendEmail, buildUnsubscribeUrl } from '@/lib/email'
import WelcomeEmail from '@/emails/WelcomeEmail'
import { createElement } from 'react'
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(req: Request) {
  const { email, source = 'website' } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('subscribers')
    .insert({ email, source })
    .select('unsubscribe_token')
    .single()

  if (error?.code === '23505') {
    return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Track subscription server-side (non-blocking)
  const posthog = getPostHogClient()
  posthog.capture({
    distinctId: email,
    event: 'newsletter_subscribed',
    properties: { source, email },
  })
  posthog.shutdown().catch(() => {})

  // Send welcome email (non-blocking — don't fail the subscribe if email fails)
  const unsubscribeUrl = buildUnsubscribeUrl(data?.unsubscribe_token ?? '')
  sendEmail({
    to: email,
    subject: 'Welcome to Agentic AI For Good',
    react: createElement(WelcomeEmail, { unsubscribeUrl }),
  }).catch((err) => console.error('[subscribe] Welcome email failed:', err))

  return NextResponse.json({ message: 'Subscribed successfully' })
}
