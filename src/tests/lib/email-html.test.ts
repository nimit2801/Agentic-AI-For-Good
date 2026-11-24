import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const send = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send } }
  }),
}))

import { sendHtmlEmail, FROM_ADDRESS } from '@/lib/email'

describe('sendHtmlEmail (shared Resend sender)', () => {
  const prev = process.env.RESEND_API_KEY
  beforeEach(() => {
    send.mockReset()
    process.env.RESEND_API_KEY = 're_test_dummy'
  })
  afterEach(() => {
    process.env.RESEND_API_KEY = prev
  })

  it('sends html + text from the verified newsletter sender', async () => {
    send.mockResolvedValue({ data: { id: 'em_1' }, error: null })
    const r = await sendHtmlEmail({ to: 'a@example.com', subject: 'S', html: '<p>h</p>', text: 't' })
    expect(r).toEqual({ success: true, id: 'em_1' })
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ from: FROM_ADDRESS, to: ['a@example.com'], subject: 'S', html: '<p>h</p>', text: 't' }),
    )
    expect(FROM_ADDRESS).toBe('Agentic AI For Good <hello@mail.agenticaiforgood.com>')
  })

  it('returns failure instead of throwing on provider error', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'bad' } })
    const r = await sendHtmlEmail({ to: 'a@example.com', subject: 'S', html: 'h', text: 't' })
    expect(r.success).toBe(false)
  })

  it('skips when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
    const r = await sendHtmlEmail({ to: 'a@example.com', subject: 'S', html: 'h', text: 't' })
    expect(r.success).toBe(false)
    expect(send).not.toHaveBeenCalled()
  })
})
