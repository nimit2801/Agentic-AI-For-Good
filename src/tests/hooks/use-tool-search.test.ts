import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

// Mock supabase before importing hooks (supabase.ts calls createClient at module load)
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}))

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { useToolSearch } from '@/hooks/use-tools'

const mockTool = (overrides = {}) => ({
  id: 'tool-1',
  name: 'LangChain',
  slug: 'langchain',
  description: 'Framework for building context-aware apps with LLMs',
  long_description: null,
  url: 'https://langchain.com',
  logo_url: null,
  category: 'Agents',
  tags: ['python', 'framework'],
  pricing: 'free' as const,
  is_open_source: true,
  featured: false,
  approved: true,
  created_at: '2026-04-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
  ...overrides,
})

// Helper: advance fake timers AND flush all pending promises
async function flushDebounce() {
  await act(async () => {
    vi.runAllTimers()
    await Promise.resolve()
  })
}

describe('useToolSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns empty results and does not fetch when query is empty', async () => {
    const { result } = renderHook(() => useToolSearch(''))
    await flushDebounce()
    expect(mockFetch).not.toHaveBeenCalled()
    expect(result.current.results).toEqual([])
    expect(result.current.method).toBe('none')
  })

  it('returns empty results and does not fetch when query is whitespace', async () => {
    const { result } = renderHook(() => useToolSearch('   '))
    await flushDebounce()
    expect(mockFetch).not.toHaveBeenCalled()
    expect(result.current.results).toEqual([])
  })

  it('fetches /api/tools/search with correct payload when query is provided', async () => {
    const tools = [mockTool()]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: tools, count: 1, method: 'semantic' }),
    })

    const { result } = renderHook(() => useToolSearch('build a RAG pipeline'))
    await flushDebounce()

    expect(mockFetch).toHaveBeenCalledWith('/api/tools/search', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }))

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.query).toBe('build a RAG pipeline')
    expect(body.useSemantic).toBe(true)
    expect(body.threshold).toBe(0.2)

    expect(result.current.results[0].name).toBe('LangChain')
    expect(result.current.method).toBe('semantic')
  })

  it('returns multiple results for broad semantic queries', async () => {
    const tools = [mockTool(), mockTool({ id: 'tool-2', name: 'LlamaIndex', slug: 'llamaindex' })]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: tools, count: 2, method: 'semantic' }),
    })

    const { result } = renderHook(() => useToolSearch('vector database'))
    await flushDebounce()

    expect(result.current.results).toHaveLength(2)
    expect(result.current.method).toBe('semantic')
  })

  it('sets error state when API returns non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Internal server error' }),
    })

    const { result } = renderHook(() => useToolSearch('test query'))
    await flushDebounce()

    expect(result.current.error).toBeTruthy()
    expect(result.current.results).toEqual([])
  })

  it('uses default threshold of 0.2', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [], count: 0, method: 'semantic' }),
    })

    renderHook(() => useToolSearch('monitor LLM costs'))
    await flushDebounce()

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.threshold).toBe(0.2)
  })

  it('respects custom threshold option', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [], count: 0, method: 'semantic' }),
    })

    renderHook(() => useToolSearch('some query', { threshold: 0.7 }))
    await flushDebounce()

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.threshold).toBe(0.7)
  })

  it('clears results when query is cleared', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [mockTool()], count: 1, method: 'semantic' }),
    })

    const { result, rerender } = renderHook(({ q }) => useToolSearch(q), {
      initialProps: { q: 'langchain' },
    })

    await flushDebounce()
    expect(result.current.results).toHaveLength(1)

    rerender({ q: '' })
    await flushDebounce()
    expect(result.current.results).toHaveLength(0)
    expect(result.current.method).toBe('none')
  })
})
