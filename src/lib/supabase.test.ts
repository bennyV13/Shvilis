import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { User, AuthError } from '@supabase/supabase-js';

const mockGetUser = vi.fn(() => Promise.resolve({ data: { user: null as User | null }, error: null as AuthError | null }));

// Mock @supabase/supabase-js to check initialization behavior
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn((url, key) => ({
      url,
      key,
      auth: {
        getUser: mockGetUser,
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      },
    })),
  };
});

describe('supabase client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize the supabase client with correct env variables', async () => {
    // Set mock env variables
    import.meta.env.VITE_SUPABASE_URL = 'https://test-project.supabase.co';
    import.meta.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';

    const { supabase } = await import('./supabase');
    expect(supabase).toBeDefined();
    
    const { createClient } = await import('@supabase/supabase-js');
    expect(createClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'test-anon-key'
    );
  });

  it('should return user ID when authenticated user is present', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: 'test-user-id-123' } as unknown as User },
      error: null,
    });

    const { getUserId } = await import('./supabase');
    const userId = await getUserId();
    expect(userId).toBe('test-user-id-123');
  });

  it('should return null when no user is logged in', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const { getUserId } = await import('./supabase');
    const userId = await getUserId();
    expect(userId).toBeNull();
  });

  it('should return null and log console error when getUser fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = { name: 'AuthError', message: 'Auth session expired', status: 401 } as unknown as AuthError;
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: mockError,
    });

    const { getUserId } = await import('./supabase');
    const userId = await getUserId();
    expect(userId).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Supabase auth error:', mockError);
    consoleSpy.mockRestore();
  });
});
