import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { sendEmail, buildUnsubscribeUrl } from '@/lib/email'
import WeeklyDigestEmail from '@/emails/WeeklyDigestEmail'
import { createElement } from 'react'

export const maxDuration = 300

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Fetch tools added in last 7 days
  const { data: newTools, error: toolsError } = await supabase
    .from('tools')
    .select('name, slug, tagline, description, category, pricing, is_open_source')
    .eq('approved', true)
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })

  if (toolsError) {
    return NextResponse.json({ error: toolsError.message }, { status: 500 })
  }

  const tools = newTools ?? []
  console.log(`[weekly-digest] ${tools.length} new tools this week`)

  // Fetch all active subscribers
  const { data: subscribers, error: subsError } = await supabase
    .from('subscribers')
    .select('email, unsubscribe_token')
    .is('unsubscribed_at', null)

  if (subsError) {
    return NextResponse.json({ error: subsError.message }, { status: 500 })
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: 'No subscribers', sent: 0 })
  }

  console.log(`[weekly-digest] Sending to ${subscribers.length} subscribers`)

  const weekOf = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Send to each subscriber
  let sent = 0
  let failed = 0

  for (const sub of subscribers) {
    const unsubscribeUrl = buildUnsubscribeUrl(sub.unsubscribe_token)
    const result = await sendEmail({
      to: sub.email,
      subject: tools.length > 0
        ? `${tools.length} new AI tool${tools.length > 1 ? 's' : ''} this week — Agentic AI For Good`
        : 'Your weekly AI tools digest — Agentic AI For Good',
      react: createElement(WeeklyDigestEmail, { tools, weekOf, unsubscribeUrl }),
    })

    if (result.success) sent++
    else failed++
  }

  console.log(`[weekly-digest] Done — ${sent} sent, ${failed} failed`)
  return NextResponse.json({ sent, failed, newTools: tools.length, subscribers: subscribers.length })
}
