import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/subscribe/route';
import { mockSupabaseClient, createMockChain } from '../__mocks__/supabase';

vi.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inserts email and returns 200 on success', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    mockChain.insert.mockReturnThis();
    mockChain.insert.mockResolvedValue({ data: { email: 'test@example.com' }, error: null });

    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', source: 'homepage' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toContain('Subscribed');
  });

  it('returns 400 when email is missing', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ source: 'homepage' }), // no email
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('returns 200 for duplicate email (error code 23505)', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    mockChain.insert.mockReturnThis();
    mockChain.insert.mockResolvedValue({
      data: null,
      error: { code: '23505', message: 'duplicate key' },
    });

    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@example.com', source: 'homepage' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toContain('Already subscribed');
  });

  it('returns 500 on other Supabase errors', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    mockChain.insert.mockReturnThis();
    mockChain.insert.mockResolvedValue({
      data: null,
      error: { message: 'Unknown database error' },
    });

    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', source: 'homepage' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
