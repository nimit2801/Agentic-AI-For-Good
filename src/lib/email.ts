import { Resend } from 'resend'
import { render } from '@react-email/render'
import type { ReactElement } from 'react'

// Lazy-initialized so missing RESEND_API_KEY at module load doesn't throw
let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export const FROM_ADDRESS = 'Agentic AI For Good <hello@mail.agenticaiforgood.com>'
export const REPLY_TO = 'hello@mail.agenticaiforgood.com'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  react: ReactElement
  replyTo?: string
}

interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail({
  to,
  subject,
  react,
  replyTo = REPLY_TO,
}: SendEmailOptions): Promise<SendEmailResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping email send')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const html = await render(react)
    const { data, error } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    })

    if (error) {
      console.error('[email] Resend error:', error)
      return { success: false, error: error.message }
    }

    console.log(`[email] Sent "${subject}" to ${Array.isArray(to) ? to.length : 1} recipient(s) — id: ${data?.id}`)
    return { success: true, id: data?.id }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[email] Unexpected error:', msg)
    return { success: false, error: msg }
  }
}

export function buildUnsubscribeUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agenticaiforgood.com'
  return `${base}/api/unsubscribe?token=${token}`
}
