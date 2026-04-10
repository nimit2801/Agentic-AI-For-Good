import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { sendEmail, buildUnsubscribeUrl } from '@/lib/email'
import SpotlightEmail from '@/emails/SpotlightEmail'
import { createElement } from 'react'

export const maxDuration = 300

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()

  // Pick a featured tool that hasn't been spotlighted recently (or ever)
  const { data: tool, error: toolError } = await supabase
    .from('tools')
    .select('*')
    .eq('approved', true)
    .eq('featured', true)
    .or('spotlight_sent_at.is.null,spotlight_sent_at.lt.' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('spotlight_sent_at', { ascending: true, nullsFirst: true })
    .limit(1)
    .single()

  if (toolError || !tool) {
    console.log('[tool-spotlight] No eligible tool found — skipping')
    return NextResponse.json({ message: 'No eligible tool for spotlight', sent: 0 })
  }

  console.log(`[tool-spotlight] Spotlighting: ${tool.name}`)

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

  console.log(`[tool-spotlight] Sending to ${subscribers.length} subscribers`)

  let sent = 0
  let failed = 0

  for (const sub of subscribers) {
    const unsubscribeUrl = buildUnsubscribeUrl(sub.unsubscribe_token)
    const result = await sendEmail({
      to: sub.email,
      subject: `Tool spotlight: ${tool.name} — Agentic AI For Good`,
      react: createElement(SpotlightEmail, { tool, unsubscribeUrl }),
    })

    if (result.success) sent++
    else failed++
  }

  // Mark tool as spotlighted
  await supabase
    .from('tools')
    .update({ spotlight_sent_at: new Date().toISOString() })
    .eq('id', tool.id)

  console.log(`[tool-spotlight] Done — ${sent} sent, ${failed} failed`)
  return NextResponse.json({ tool: tool.slug, sent, failed })
}
