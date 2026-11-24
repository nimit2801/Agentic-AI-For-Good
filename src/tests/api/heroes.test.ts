import { describe, it, expect, vi, beforeEach } from 'vitest'

const insertMock = vi.fn()
const fromMock = vi.fn(() => ({ insert: insertMock }))

vi.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: vi.fn(() => ({ from: fromMock })),
}))

// Mock the shared Resend wrapper so no real email is sent
const sendHtmlEmail = vi.fn()
vi.mock('@/lib/email', () => ({
  sendHtmlEmail: (...args: unknown[]) => sendHtmlEmail(...args),
}))

import { POST } from '@/app/api/heroes/route'

const base = {
  nomineeName: 'Ada Lovelace',
  relationship: 'other',
  categories: ['Open Source', 'Events'],
  links: 'https://github.com/ada',
  description: 'Runs an agent builders meetup and maintains an MCP server.',
  nominatorName: 'Nimit',
  nominatorEmail: 'nominator@example.com',
  startedAt: 0,
}

function req(body: Record<string, unknown>) {
  return new Request('http://localhost/api/heroes', { method: 'POST', body: JSON.stringify(body) })
}

describe('POST /api/heroes confirmation email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    insertMock.mockResolvedValue({ error: null })
    sendHtmlEmail.mockResolvedValue({ success: true, id: 'em_123' })
  })

  it('saves the nomination and triggers a confirmation email', async () => {
    const res = await POST(req(base))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, emailSent: true })
    expect(fromMock).toHaveBeenCalledWith('hero_nominations')
    expect(insertMock).toHaveBeenCalledTimes(1)
    expect(sendHtmlEmail).toHaveBeenCalledTimes(1)
    // Saved before the email is attempted
    expect(insertMock.mock.invocationCallOrder[0]).toBeLessThan(sendHtmlEmail.mock.invocationCallOrder[0])
  })

  it('sends to the submitter email', async () => {
    await POST(req(base))
    expect(sendHtmlEmail.mock.calls[0][0].to).toBe('nominator@example.com')
  })

  it('subject and body contain the submitted fields', async () => {
    await POST(req(base))
    const { subject, html, text } = sendHtmlEmail.mock.calls[0][0]
    expect(subject).toBe('Thanks for nominating Ada Lovelace for Agentic AI Heroes')
    for (const body of [html, text]) {
      expect(body).toContain('Ada Lovelace')
      expect(body).toContain('Someone else')
      expect(body).toContain('Open Source, Events')
      expect(body).toContain('https://github.com/ada')
      expect(body).toContain('Runs an agent builders meetup and maintains an MCP server.')
      expect(body).toContain('Agentic AI For Good')
      expect(body).not.toContain('\u2014') // no em dashes
    }
  })

  it('uses a self-nomination subject when nominating yourself', async () => {
    await POST(req({ ...base, relationship: 'self' }))
    const { subject, text } = sendHtmlEmail.mock.calls[0][0]
    expect(subject).toBe('Thanks for nominating yourself for Agentic AI Heroes')
    expect(text).toContain('Who: Yourself')
  })

  it('HTML-escapes user input in the email body', async () => {
    await POST(
      req({
        ...base,
        nomineeName: '<script>alert(1)</script>',
        description: 'Tom & "Jerry" <b>bold</b>',
        nominatorName: '<img src=x onerror=alert(1)>',
      }),
    )
    const { html, subject } = sendHtmlEmail.mock.calls[0][0]
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img src=x')
    expect(html).not.toContain('<b>bold</b>')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('Tom &amp; &quot;Jerry&quot; &lt;b&gt;bold&lt;/b&gt;')
    expect(subject).not.toMatch(/[\r\n]/)
  })

  it('does not send an email when no email is given', async () => {
    const res = await POST(req({ ...base, nominatorEmail: '' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, emailSent: false })
    expect(insertMock).toHaveBeenCalledTimes(1)
    expect(sendHtmlEmail).not.toHaveBeenCalled()
  })

  it('still succeeds and saves the row when the email send fails', async () => {
    sendHtmlEmail.mockResolvedValueOnce({ success: false, error: 'provider down' })
    const res = await POST(req(base))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, emailSent: false })
    expect(insertMock).toHaveBeenCalledTimes(1)
  })

  it('still succeeds when the email client throws', async () => {
    sendHtmlEmail.mockRejectedValueOnce(new Error('network'))
    const res = await POST(req(base))
    expect(res.status).toBe(200)
    expect((await res.json()).ok).toBe(true)
    expect(insertMock).toHaveBeenCalledTimes(1)
  })

  it('does not send an email when saving fails', async () => {
    insertMock.mockResolvedValueOnce({ error: { message: 'db down' } })
    const res = await POST(req(base))
    expect(res.status).toBe(500)
    expect(sendHtmlEmail).not.toHaveBeenCalled()
  })
})
