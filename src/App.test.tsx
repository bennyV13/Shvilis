import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';

// Mock Supabase client
vi.mock('./lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
        getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      },
    },
  };
});

// Mock Sentry
vi.mock('@sentry/react', () => {
  return {
    ErrorBoundary: ({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) => (
      <div data-testid="sentry-error-boundary" data-fallback={fallback ? 'yes' : 'no'}>{children}</div>
    ),
    setUser: vi.fn(),
  };
});

describe('App Component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render the application header and default tab', () => {
    render(<App />);

    // Header title
    expect(screen.getByText('Shvilis')).toBeDefined();

    // Default tab should be Meal Planner
    expect(screen.getByText('Meal Planner')).toBeDefined();
    expect(screen.getByText('Gear Checklist')).toBeDefined();
  });

  it('should switch tabs when clicked', async () => {
    render(<App />);

    // Initial state: click on Gear Checklist tab
    const checklistTab = screen.getByRole('button', { name: /gear checklist/i });
    fireEvent.click(checklistTab);

    // Should render Checklist components (like weather form / pack base weight)
    expect(screen.getByText(/trip profile/i)).toBeDefined();
  });

  it('should wrap the main layout in Sentry ErrorBoundary', () => {
    render(<App />);
    expect(screen.getByTestId('sentry-error-boundary')).toBeDefined();
  });
});
