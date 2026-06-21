import { describe, it, expect, vi } from 'vitest';

// Mock @supabase/supabase-js to check initialization behavior
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn((url, key) => ({
      url,
      key,
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      },
    })),
  };
});

describe('supabase client', () => {
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
});
