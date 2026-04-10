import { useState, useEffect, useCallback } from 'react';
import { supabase, type Tool } from '@/lib/supabase';

export interface UseToolsOptions {
  limit?: number;
  offset?: number;
  category?: string;
  tags?: string[];
}

export function useTools(options?: UseToolsOptions) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTools() {
      setLoading(true);
      let query = supabase
        .from('tools')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      // Apply category filter if provided
      if (options?.category) {
        query = query.eq('category', options.category);
      }

      // Apply pagination if provided
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setTools(data ?? []);
      }
      setLoading(false);
    }

    fetchTools();
  }, [options?.category, options?.limit, options?.offset]);

  return { tools, loading, error };
}

export function useTool(slug: string) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTool() {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', slug)
        .eq('approved', true)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setTool(data);
      }
      setLoading(false);
    }

    if (slug) fetchTool();
  }, [slug]);

  return { tool, loading, error };
}

export interface UseToolSearchOptions {
  limit?: number;
  threshold?: number;
  useSemantic?: boolean;
  category?: string;
  tags?: string[];
}

export interface SearchResult extends Tool {
  similarity?: number;
  rank?: number;
}

export function useToolSearch(query: string, options?: UseToolSearchOptions) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'semantic' | 'keyword' | 'fallback-text' | 'keyword-fallback' | 'none'>('none');

  useEffect(() => {
    async function searchTools() {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        setMethod('none');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/tools/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            limit: options?.limit || 10,
            threshold: options?.threshold || 0.2,
            useSemantic: options?.useSemantic !== false, // default true
            category: options?.category,
            tags: options?.tags,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Search failed');
        }

        const data = await response.json();
        setResults(data.results || []);
        setMethod(data.method || 'none');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchTools();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, options?.limit, options?.threshold, options?.useSemantic, options?.category, options?.tags?.join(',')]);

  return { results, loading, error, method };
}


// Hook for fetching similar tools based on a tool's category and tags
export function useSimilarTools(toolId: string, limit: number = 3) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      // First get the target tool to find its category and tags
      const { data: targetTool } = await supabase
        .from('tools')
        .select('category, tags')
        .eq('id', toolId)
        .single();

      if (!targetTool) {
        setLoading(false);
        return;
      }

      // Find tools with same category or overlapping tags
      let query = supabase
        .from('tools')
        .select('*')
        .eq('approved', true)
        .neq('id', toolId);

      if (targetTool.category) {
        query = query.eq('category', targetTool.category);
      }

      if (targetTool.tags && targetTool.tags.length > 0) {
        query = query.contains('tags', targetTool.tags.slice(0, 2));
      }

      const { data } = await query.limit(limit);
      setTools(data || []);
      setLoading(false);
    }

    if (toolId) fetchSimilar();
  }, [toolId, limit]);

  return { tools, loading };
}
