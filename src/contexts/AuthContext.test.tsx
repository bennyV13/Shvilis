import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForms } from '../components/AuthForms';

// Mock Supabase client
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: vi.fn() } },
}));

vi.mock('../lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
        onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args),
        signInWithPassword: (...args: any[]) => mockSignInWithPassword(...args),
        signUp: (...args: any[]) => mockSignUp(...args),
        signOut: (...args: any[]) => mockSignOut(...args),
      },
    },
  };
});

// A helper component to test the useAuth hook
const TestHookComponent = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? 'yes' : 'no'}</span>
      <span data-testid="user">{user ? user.email : 'guest'}</span>
      <button data-testid="btn-login" onClick={() => signIn('test@example.com', 'password')}>
        Log In
      </button>
      <button data-testid="btn-signup" onClick={() => signUp('new@example.com', 'password')}>
        Sign Up
      </button>
      <button data-testid="btn-logout" onClick={() => signOut()}>
        Log Out
      </button>
    </div>
  );
};

describe('AuthContext and useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial auth state and handle loading state', async () => {
    render(
      <AuthProvider>
        <TestHookComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('guest');
  });

  it('should call supabase signInWithPassword on login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ data: { user: { email: 'test@example.com' } }, error: null });

    render(
      <AuthProvider>
        <TestHookComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('btn-login'));
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should call supabase signUp on registration', async () => {
    mockSignUp.mockResolvedValueOnce({ data: { user: { email: 'new@example.com' } }, error: null });

    render(
      <AuthProvider>
        <TestHookComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('btn-signup'));
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'password',
    });
  });

  it('should call supabase signOut on logout', async () => {
    mockSignOut.mockResolvedValueOnce({ error: null });

    render(
      <AuthProvider>
        <TestHookComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('btn-logout'));
    expect(mockSignOut).toHaveBeenCalled();
  });
});

describe('AuthForms Component', () => {
  it('should render sign-in form elements by default and switch to sign-up', () => {
    render(
      <AuthProvider>
        <AuthForms />
      </AuthProvider>
    );

    // Initial view: Sign In
    expect(screen.getByPlaceholderText('Email Address')).toBeDefined();
    expect(screen.getByPlaceholderText('Password')).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();

    // Click "Need an account? Sign Up" link/button
    const switchBtn = screen.getByText(/need an account\?/i);
    fireEvent.click(switchBtn);

    // Switch view: Sign Up
    expect(screen.getByRole('button', { name: /create account/i })).toBeDefined();
  });
});
