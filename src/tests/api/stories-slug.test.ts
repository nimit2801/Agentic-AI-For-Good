import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/stories/[slug]/route';
import { mockSupabaseClient, createMockChain } from '../__mocks__/supabase';

vi.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

describe('GET /api/stories/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns story for valid slug with status 200', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    const mockStory = {
      id: '1',
      title: 'Test Story',
      slug: 'test-story',
      description: 'A test story',
      published: true,
      created_at: '2026-04-07T00:00:00Z',
    };

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.single.mockResolvedValue({ data: mockStory, error: null });

    const req = new Request('http://localhost/api/stories/test-story');
    const res = await GET(req, { params: Promise.resolve({ slug: 'test-story' }) });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockStory);
  });

  it('returns 404 for unknown slug', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.single.mockResolvedValue({ data: null, error: { message: 'not found' } });

    const req = new Request('http://localhost/api/stories/unknown-slug');
    const res = await GET(req, { params: Promise.resolve({ slug: 'unknown-slug' }) });

    expect(res.status).toBe(404);
  });

  it('returns 404 when single() errors', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.single.mockResolvedValue({
      data: null,
      error: { message: 'Multiple or no rows returned' },
    });

    const req = new Request('http://localhost/api/stories/bad-slug');
    const res = await GET(req, { params: Promise.resolve({ slug: 'bad-slug' }) });

    expect(res.status).toBe(404);
  });
});
