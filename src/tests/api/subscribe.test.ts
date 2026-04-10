import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockSupabaseClient } from '../__mocks__/supabase'

vi.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: vi.fn(() => mockSupabaseClient),
}))

// Mock email so tests don't need RESEND_API_KEY
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
  buildUnsubscribeUrl: vi.fn().mockReturnValue('https://agenticaiforgood.com/api/unsubscribe?token=test'),
}))

import { POST } from '@/app/api/subscribe/route'

// Helper: builds a chain that handles .insert().select().single()
function makeInsertChain(result: { data: any; error: any }) {
  const single = vi.fn().mockResolvedValue(result)
  const select = vi.fn().mockReturnValue({ single })
  const insert = vi.fn().mockReturnValue({ select })
  return { insert, select, single }
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('inserts email and returns 200 on success', async () => {
    const chain = makeInsertChain({ data: { unsubscribe_token: 'abc-123' }, error: null })
    mockSupabaseClient.from = vi.fn().mockReturnValue(chain)

    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', source: 'homepage' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toContain('Subscribed')
  })

  it('returns 400 when email is missing', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ source: 'homepage' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 for duplicate email (error code 23505)', async () => {
    const chain = makeInsertChain({ data: null, error: { code: '23505', message: 'duplicate key' } })
    mockSupabaseClient.from = vi.fn().mockReturnValue(chain)

    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@example.com', source: 'homepage' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toContain('Already subscribed')
  })

  it('returns 500 on other Supabase errors', async () => {
    const chain = makeInsertChain({ data: null, error: { message: 'Unknown database error' } })
    mockSupabaseClient.from = vi.fn().mockReturnValue(chain)

    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', source: 'homepage' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })
})
