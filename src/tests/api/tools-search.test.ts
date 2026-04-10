import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockSupabaseClient } from '../__mocks__/supabase'

vi.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: vi.fn(() => mockSupabaseClient),
}))

// vi.mock factories are hoisted — use vi.hoisted to define the fn first
const { mockEmbeddingCreate } = vi.hoisted(() => ({
  mockEmbeddingCreate: vi.fn(),
}))

vi.mock('openai', () => {
  class MockOpenAI {
    embeddings = { create: mockEmbeddingCreate }
    constructor(_opts: unknown) {}
  }
  return { default: MockOpenAI }
})

import { POST, GET } from '@/app/api/tools/search/route'

const mockTool = (overrides = {}) => ({
  id: 'tool-1',
  slug: 'langchain',
  name: 'LangChain',
  description: 'Framework for LLM apps',
  category: 'Agents',
  pricing: 'free',
  approved: true,
  ...overrides,
})

describe('POST /api/tools/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = 'test-key'
  })

  it('returns empty results for blank query', async () => {
    const req = new Request('http://localhost/api/tools/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '   ' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.results).toEqual([])
    expect(body.method).toBe('none')
    expect(mockEmbeddingCreate).not.toHaveBeenCalled()
  })

  it('performs semantic search and returns results', async () => {
    const tools = [mockTool()]
    mockEmbeddingCreate.mockResolvedValueOnce({
      data: [{ embedding: Array(1536).fill(0.1) }],
    })
    mockSupabaseClient.from = vi.fn()
    const rpcMock = vi.fn().mockResolvedValue({ data: tools, error: null })
    mockSupabaseClient.rpc = rpcMock

    const req = new Request('http://localhost/api/tools/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'build a RAG pipeline', useSemantic: true, threshold: 0.2 }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.method).toBe('semantic')
    expect(body.results).toHaveLength(1)
    expect(body.results[0].name).toBe('LangChain')
  })

  it('falls back to keyword search when OpenAI key is missing', async () => {
    delete process.env.OPENAI_API_KEY
    const tools = [mockTool()]
    const rpcMock = vi.fn().mockResolvedValue({ data: tools, error: null })
    mockSupabaseClient.rpc = rpcMock

    const req = new Request('http://localhost/api/tools/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'langchain', useSemantic: true }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.method).toBe('keyword')
    expect(mockEmbeddingCreate).not.toHaveBeenCalled()
  })

  it('falls back to keyword search when useSemantic=false', async () => {
    const tools = [mockTool()]
    const rpcMock = vi.fn().mockResolvedValue({ data: tools, error: null })
    mockSupabaseClient.rpc = rpcMock

    const req = new Request('http://localhost/api/tools/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'langchain', useSemantic: false }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.method).toBe('keyword')
    expect(mockEmbeddingCreate).not.toHaveBeenCalled()
  })

  it('passes threshold and limit to semantic search RPC', async () => {
    mockEmbeddingCreate.mockResolvedValueOnce({
      data: [{ embedding: Array(1536).fill(0.1) }],
    })
    const rpcMock = vi.fn().mockResolvedValue({ data: [], error: null })
    mockSupabaseClient.rpc = rpcMock

    const req = new Request('http://localhost/api/tools/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'vector database', threshold: 0.3, limit: 20 }),
    })
    await POST(req)

    expect(rpcMock).toHaveBeenCalledWith('search_tools', expect.objectContaining({
      match_threshold: 0.3,
      match_count: 20,
    }))
  })
})

describe('GET /api/tools/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty results for blank q param', async () => {
    const req = new Request('http://localhost/api/tools/search?q=')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.results).toEqual([])
  })

  it('calls keyword_search_tools RPC with query', async () => {
    const tools = [mockTool()]
    const rpcMock = vi.fn().mockResolvedValue({ data: tools, error: null })
    mockSupabaseClient.rpc = rpcMock

    const req = new Request('http://localhost/api/tools/search?q=langchain&limit=5')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(rpcMock).toHaveBeenCalledWith('keyword_search_tools', {
      search_query: 'langchain',
      match_count: 5,
    })
  })
})
