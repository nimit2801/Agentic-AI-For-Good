import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { sendEmail, buildUnsubscribeUrl } from '@/lib/email'
import WeeklyDigestEmail from '@/emails/WeeklyDigestEmail'
import { createElement } from 'react'
import { getDigestTools, issueUrl, istDateKey } from '@/lib/newsletter'

export const maxDuration = 300

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()
  const now = new Date()
  const webUrl = issueUrl(istDateKey(now))

  // Tools added in the last 7 days (same window the public archive page renders)
  let tools
  try {
    tools = await getDigestTools(now)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
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
      react: createElement(WeeklyDigestEmail, { tools, weekOf, unsubscribeUrl, issueUrl: webUrl }),
    })

    if (result.success) sent++
    else failed++
  }

  console.log(`[weekly-digest] Done — ${sent} sent, ${failed} failed`)
  return NextResponse.json({ sent, failed, newTools: tools.length, subscribers: subscribers.length, issueUrl: webUrl })
}
