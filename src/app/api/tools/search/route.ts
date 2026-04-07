import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      query,
      limit = 10,
      threshold = 0.5,
      useSemantic = true,
      category,
      tags,
    } = body as {
      query: string
      limit?: number
      threshold?: number
      useSemantic?: boolean
      category?: string
      tags?: string[]
    }

    if (!query?.trim()) {
      return NextResponse.json({ results: [], count: 0, method: 'none' })
    }

    const supabase = createServerSupabaseClient()

    // If OpenAI API key is not configured or semantic search is disabled, fallback to text search
    if (!process.env.OPENAI_API_KEY || !useSemantic) {
      const { data, error } = await supabase.rpc('keyword_search_tools', {
        search_query: query,
        match_count: limit,
      })

      if (error) {
        console.error('Keyword search error:', error)
        // Fallback to simple ilike search
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('tools')
          .select('*')
          .eq('approved', true)
          .or(
            `name.ilike.%${query}%,description.ilike.%${query}%,long_description.ilike.%${query}%`
          )
          .limit(limit)

        if (fallbackError) {
          return NextResponse.json(
            { error: fallbackError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({
          results: fallbackData || [],
          count: fallbackData?.length || 0,
          method: 'fallback-text',
        })
      }

      return NextResponse.json({
        results: data || [],
        count: data?.length || 0,
        method: 'keyword',
      })
    }

    // Generate embedding for the search query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
      dimensions: 1536,
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    // Perform semantic search using pgvector
    const { data, error } = await supabase.rpc('search_tools', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
      filter_category: category || null,
      filter_tags: tags && tags.length > 0 ? tags : null,
    })

    if (error) {
      console.error('Semantic search error:', error)

      // Fallback to keyword search on error
      const { data: keywordData, error: keywordError } = await supabase.rpc(
        'keyword_search_tools',
        {
          search_query: query,
          match_count: limit,
        }
      )

      if (keywordError) {
        return NextResponse.json(
          { error: 'Search failed and fallback also failed' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        results: keywordData || [],
        count: keywordData?.length || 0,
        method: 'keyword-fallback',
      })
    }

    return NextResponse.json({
      results: data || [],
      count: data?.length || 0,
      method: 'semantic',
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

// GET endpoint for simple text-based search (backward compatible)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query?.trim()) {
    return NextResponse.json({ results: [], count: 0 })
  }

  const supabase = createServerSupabaseClient()

  // Use simple text search for GET requests
  const { data, error } = await supabase.rpc('keyword_search_tools', {
    search_query: query,
    match_count: limit,
  })

  if (error) {
    // Fallback to ilike
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('tools')
      .select('*')
      .eq('approved', true)
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,long_description.ilike.%${query}%`
      )
      .limit(limit)

    if (fallbackError) {
      return NextResponse.json(
        { error: fallbackError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ results: fallbackData || [], count: fallbackData?.length || 0 })
  }

  return NextResponse.json({ results: data || [], count: data?.length || 0 })
}
