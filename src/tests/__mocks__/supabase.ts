import { vi } from 'vitest';

export const createMockChain = () => {
  const chain: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
  };

  // Make chain itself thenable (for awaiting without .single())
  Object.defineProperty(chain, 'then', {
    value: (resolve: (value: { data: any; error: any }) => void) => {
      return Promise.resolve({ data: [], error: null }).then(resolve);
    },
    configurable: true,
  });

  return chain;
};

export const mockChain = createMockChain();

export const mockSupabaseClient = {
  from: vi.fn().mockReturnValue(mockChain),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
};
