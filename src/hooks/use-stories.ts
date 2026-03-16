import { useState, useEffect } from 'react';
import { supabase, type Story } from '@/lib/supabase';

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setStories(data ?? []);
      }
      setLoading(false);
    }

    fetchStories();
  }, []);

  return { stories, loading, error };
}

export function useAllStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStories() {
    setLoading(true);
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setStories(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStories();
  }, []);

  return { stories, loading, error, refetch: fetchStories };
}

export function useStory(slug: string) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStory() {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setStory(data);
      }
      setLoading(false);
    }

    if (slug) fetchStory();
  }, [slug]);

  return { story, loading, error };
}
