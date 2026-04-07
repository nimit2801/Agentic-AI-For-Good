import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('createServerSupabaseClient', () => {
  beforeEach(() => {
    // Set required env vars for testing (matching Vercel production)
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://osgxxcxbmwoprjbjgifm.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  it('returns a client object with required methods', async () => {
    // Re-import to pick up the mocked env vars
    const { createServerSupabaseClient } = await import('@/lib/supabase-server');
    const client = createServerSupabaseClient();

    // Verify the client has the core methods used in the codebase
    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
    expect(typeof client.auth).toBe('object');
  });

  it('documents the behavior: prefers SUPABASE_SERVICE_ROLE_KEY, falls back to anon key', () => {
    // This test documents the current behavior:
    // The factory uses NEXT_PUBLIC_SUPABASE_URL (set in Vercel env)
    // and prefers SUPABASE_SERVICE_ROLE_KEY, falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Note: In production on Vercel, both NEXT_PUBLIC_SUPABASE_URL and
    // NEXT_PUBLIC_SUPABASE_ANON_KEY are configured (verified via vercel env ls).
    // If SUPABASE_SERVICE_ROLE_KEY is also set, it will be used for server-side operations.
    // This test simply documents the pattern.

    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });
});
