import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { mockSupabaseClient } from '../__mocks__/supabase';

// Mock before importing the hook
vi.mock('@/lib/supabase', () => ({ supabase: mockSupabaseClient }));

import { useAuth } from '@/hooks/use-auth';

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with user: null and loading: true', () => {
    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('sets user from existing session', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('updates user via onAuthStateChange callback', async () => {
    let authCallback: ((event: string, session: any) => void) | undefined;

    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null } });
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useAuth());

    const mockUser = { id: 'user-1', email: 'new@example.com' };
    act(() => {
      if (authCallback) authCallback('SIGNED_IN', { user: mockUser });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('unsubscribes on unmount', () => {
    const mockUnsubscribe = vi.fn();
    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('signIn calls signInWithPassword with credentials', async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('signIn throws on auth error', async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    const { result } = renderHook(() => useAuth());

    await expect(
      act(async () => {
        await result.current.signIn('test@example.com', 'wrong');
      })
    ).rejects.toThrow();
  });

  it('signOut calls supabase.auth.signOut', async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
  });
});
