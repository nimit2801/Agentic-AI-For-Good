import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { mockSupabaseClient, mockChain } from '../__mocks__/supabase';

// Mock before importing the hook
vi.mock('@/lib/supabase', () => ({ supabase: mockSupabaseClient }));

import { useStories, useStory, useAllStories } from '@/hooks/use-stories';

describe('useStories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChain.select.mockClear();
    mockChain.eq.mockClear();
    mockChain.order.mockClear();
  });

  it('initializes with loading: true and empty stories', () => {
    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.order.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useStories());

    expect(result.current.loading).toBe(true);
    expect(result.current.stories).toEqual([]);
  });

  it('populates stories on successful fetch', async () => {
    const mockStories = [
      { id: '1', title: 'Story 1', slug: 'story-1', published: true, created_at: '2026-04-07T00:00:00Z' },
    ];

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.order.mockResolvedValue({ data: mockStories, error: null });

    const { result } = renderHook(() => useStories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stories).toEqual(mockStories);
  });

  it('sets error on fetch failure', async () => {
    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.order.mockResolvedValue({ data: null, error: { message: 'DB error' } });

    const { result } = renderHook(() => useStories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.stories).toEqual([]);
  });
});

describe('useStory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single story by slug', async () => {
    const mockStory = {
      id: '1',
      title: 'Story',
      slug: 'story-slug',
      published: true,
      created_at: '2026-04-07T00:00:00Z',
    };

    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.single.mockResolvedValue({ data: mockStory, error: null });

    const { result } = renderHook(() => useStory('story-slug'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.story).toEqual(mockStory);
  });

  it('skips fetch when slug is empty', () => {
    const { result } = renderHook(() => useStory(''));

    // When slug is empty, fetchStory is not called, so loading stays true
    expect(result.current.loading).toBe(true);
    expect(result.current.story).toBeNull();
  });

  it('sets error when story not found', async () => {
    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockChain.single.mockResolvedValue({ data: null, error: { message: 'not found' } });

    const { result } = renderHook(() => useStory('unknown'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useAllStories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches all stories without published filter', async () => {
    const mockStories = [
      { id: '1', title: 'Published', published: true, created_at: '2026-04-07T00:00:00Z' },
      { id: '2', title: 'Draft', published: false, created_at: '2026-04-07T00:00:00Z' },
    ];

    mockChain.select.mockReturnThis();
    mockChain.order.mockResolvedValue({ data: mockStories, error: null });

    const { result } = renderHook(() => useAllStories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stories).toEqual(mockStories);
  });

  it('exposes refetch function', async () => {
    mockChain.select.mockReturnThis();
    mockChain.order.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useAllStories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe('function');
  });
});
