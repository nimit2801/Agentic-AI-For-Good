import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from '@/app/api/admin/stories/route';
import { mockSupabaseClient, createMockChain } from '../__mocks__/supabase';

vi.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

describe('GET /api/admin/stories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all stories (no published filter)', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    const mockStories = [
      { id: '1', title: 'Published Story', published: true },
      { id: '2', title: 'Draft Story', published: false },
    ];

    mockChain.select.mockReturnThis();
    mockChain.order.mockResolvedValue({ data: mockStories, error: null });

    const req = new Request('http://localhost/api/admin/stories');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockStories);
  });

  it('returns single story when ?id= param is provided', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    const mockStory = { id: '1', title: 'Story', published: true };

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.single.mockResolvedValue({ data: mockStory, error: null });

    const req = new Request('http://localhost/api/admin/stories?id=1');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockStory);
  });
});

describe('PATCH /api/admin/stories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates story by id and sets updated_at', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    const updateBody = { id: '1', title: 'Updated Title' };

    mockChain.update.mockReturnThis();
    mockChain.eq.mockResolvedValue({ data: [updateBody], error: null });

    const req = new Request('http://localhost/api/admin/stories', {
      method: 'PATCH',
      body: JSON.stringify(updateBody),
    });
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('success');
  });

  it('returns 500 on update error', async () => {
    const mockChain = createMockChain();
    mockSupabaseClient.from.mockReturnValue(mockChain);

    mockChain.update.mockReturnThis();
    mockChain.eq.mockResolvedValue({ data: null, error: { message: 'DB error' } });

    const req = new Request('http://localhost/api/admin/stories', {
      method: 'PATCH',
      body: JSON.stringify({ id: '1', title: 'Title' }),
    });
    const res = await PATCH(req);

    expect(res.status).toBe(500);
  });
});
