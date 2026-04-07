import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/stories/route';
import { mockSupabaseClient, createMockChain } from '../__mocks__/supabase';

vi.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

describe('GET /api/stories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns published stories array with status 200', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    const mockStories = [
      {
        id: '1',
        title: 'Story 1',
        slug: 'story-1',
        description: 'Test story',
        published: true,
        created_at: '2026-04-07T00:00:00Z',
      },
    ];

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.order.mockResolvedValue({ data: mockStories, error: null });

    const req = new Request('http://localhost/api/stories');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockStories);
  });

  it('returns empty array when no published stories', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.order.mockResolvedValue({ data: [], error: null });

    const req = new Request('http://localhost/api/stories');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });

  it('returns 500 on Supabase error', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.order.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    const req = new Request('http://localhost/api/stories');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });
});
