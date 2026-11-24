import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { sendHeroConfirmationEmail } from '@/lib/heroes-email'

const CATEGORIES = ['Events', 'Blog/Content', 'Tech/Builder', 'Open Source', 'Advocacy/Community']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: real people never fill this hidden field. Pretend success for bots.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true })
  }
  // Too-fast submissions (under 3s after page load) are almost always bots.
  const startedAt = Number(body.startedAt)
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 3000) {
    return NextResponse.json({ ok: true })
  }

  const nominee_name = clean(body.nomineeName, 200)
  const relationship = body.relationship === 'self' ? 'self' : body.relationship === 'other' ? 'other' : ''
  const description = clean(body.description, 500)
  const links = clean(body.links, 2000)
  const nominator_name = clean(body.nominatorName, 200)
  const nominator_email = clean(body.nominatorEmail, 320)
  const categories = Array.isArray(body.categories)
    ? body.categories.filter((c): c is string => typeof c === 'string' && CATEGORIES.includes(c))
    : []

  if (!nominee_name) return NextResponse.json({ error: 'Nominee name is required' }, { status: 400 })
  if (!relationship) return NextResponse.json({ error: 'Pick self or someone else' }, { status: 400 })
  if (categories.length === 0) return NextResponse.json({ error: 'Pick at least one category' }, { status: 400 })
  if (!description) return NextResponse.json({ error: 'Add a short description' }, { status: 400 })
  if (nominator_email && !EMAIL_RE.test(nominator_email)) {
    return NextResponse.json({ error: 'That email does not look right' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('hero_nominations').insert({
    nominee_name,
    relationship,
    categories,
    description,
    links: links || null,
    nominator_name: nominator_name || null,
    nominator_email: nominator_email || null,
    user_agent: clean(req.headers.get('user-agent'), 300) || null,
  })

  if (error) {
    console.error('[heroes] insert failed:', error.message)
    return NextResponse.json({ error: 'Could not save your nomination. Please try again.' }, { status: 500 })
  }

  // Nomination is saved. Now try the confirmation email; a failure here never fails the submission.
  let emailSent = false
  if (nominator_email) {
    try {
      const result = await sendHeroConfirmationEmail(nominator_email, {
        nomineeName: nominee_name,
        relationship: relationship as 'self' | 'other',
        categories,
        links,
        description,
        nominatorName: nominator_name || undefined,
      })
      emailSent = result.success
      if (!result.success) console.error('[heroes] confirmation email failed:', result.error)
    } catch (err) {
      console.error('[heroes] confirmation email threw:', err instanceof Error ? err.message : String(err))
    }
  }
  return NextResponse.json({ ok: true, emailSent })
}
