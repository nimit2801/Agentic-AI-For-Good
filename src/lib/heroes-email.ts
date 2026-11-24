import { sendHtmlEmail } from '@/lib/email'

export interface HeroNominationSummary {
  nomineeName: string
  relationship: 'self' | 'other'
  categories: string[]
  links: string
  description: string
  nominatorName?: string
}

export function escapeHtml(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function stripControl(v: string): string {
  // Keep subjects single-line so user input can't inject headers or line breaks.
  return v.replace(/[\r\n\t\u0000-\u001f\u007f]+/g, ' ').trim()
}

export function buildHeroConfirmationEmail(n: HeroNominationSummary) {
  const who = n.relationship === 'self' ? 'Yourself' : 'Someone else'
  const nameForSubject = stripControl(n.nomineeName).slice(0, 80)
  const subject =
    n.relationship === 'self'
      ? 'Thanks for nominating yourself for Agentic AI Heroes'
      : `Thanks for nominating ${nameForSubject} for Agentic AI Heroes`
  const greeting = n.nominatorName ? `Hi ${n.nominatorName},` : 'Hi there,'
  const links = n.links.trim() || 'None given'
  const categories = n.categories.join(', ')

  const text = [
    greeting,
    '',
    'Thanks for your Agentic AI Heroes nomination. We got it, and here is what you sent us:',
    '',
    `Nominee: ${n.nomineeName}`,
    `Who: ${who}`,
    `Categories: ${categories}`,
    `Links: ${links}`,
    `Description: ${n.description}`,
    '',
    "We read every nomination. If we'd like to spotlight someone, we'll reach out to them first.",
    '',
    'Agentic AI For Good',
    'https://agenticaiforgood.com/heroes',
  ].join('\n')

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#1f1f1f;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`

  const html = `<!doctype html><html><body style="margin:0;background:#f7f3ec;font-family:Inter,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#c2553a;margin:0 0 8px">Agentic AI Heroes</p>
<h1 style="font-size:22px;color:#1f1f1f;margin:0 0 16px">Thanks for your nomination</h1>
<p style="color:#1f1f1f;line-height:1.5">${escapeHtml(greeting)}</p>
<p style="color:#1f1f1f;line-height:1.5">We got your Agentic AI Heroes nomination. Here is what you sent us:</p>
<table style="border-collapse:collapse;font-size:14px;margin:12px 0 20px">
${row('Nominee', n.nomineeName)}
${row('Who', who)}
${row('Categories', categories)}
${row('Links', links)}
${row('Description', n.description)}
</table>
<p style="color:#1f1f1f;line-height:1.5">We read every nomination. If we'd like to spotlight someone, we'll reach out to them first.</p>
<p style="color:#6b6b6b;font-size:13px;margin-top:28px">Agentic AI For Good<br><a href="https://agenticaiforgood.com/heroes" style="color:#c2553a">agenticaiforgood.com/heroes</a></p>
</div></body></html>`

  return { subject, html, text }
}

export async function sendHeroConfirmationEmail(to: string, n: HeroNominationSummary) {
  const { subject, html, text } = buildHeroConfirmationEmail(n)
  return sendHtmlEmail({ to, subject, html, text })
}
