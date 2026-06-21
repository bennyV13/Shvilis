import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/react';

vi.mock('@sentry/react', () => {
  return {
    init: vi.fn(),
    browserTracingIntegration: vi.fn(() => ({ name: 'BrowserTracing' })),
    replayIntegration: vi.fn(() => ({ name: 'Replay' })),
    feedbackIntegration: vi.fn(() => ({ name: 'Feedback' })),
    consoleLoggingIntegration: vi.fn(() => ({ name: 'ConsoleLogging' })),
    globalHandlersIntegration: vi.fn(() => ({ name: 'GlobalHandlers' })),
    setTag: vi.fn(),
    getReplay: vi.fn(),
    flush: vi.fn(),
  };
});

describe('Sentry Instrumentation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should initialize Sentry with configured DSN and required integrations', async () => {
    import.meta.env.VITE_SENTRY_DSN = 'https://test-dsn@sentry.io/123';

    await import('./instrument');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://test-dsn@sentry.io/123',
        sendDefaultPii: true,
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
      })
    );
  });

  it('should log a console error if VITE_SENTRY_DSN is missing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    import.meta.env.VITE_SENTRY_DSN = '';

    await import('./instrument');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Sentry] VITE_SENTRY_DSN is not set')
    );
    consoleSpy.mockRestore();
  });

  it('should flush replay on beforeunload if replay is available', async () => {
    const mockFlush = vi.fn();
    vi.mocked(Sentry.getReplay).mockReturnValue({ flush: mockFlush } as unknown as ReturnType<typeof Sentry.getReplay>);

    await import('./instrument');
    window.dispatchEvent(new Event('beforeunload'));

    expect(mockFlush).toHaveBeenCalled();
  });

  it('should fallback to general Sentry.flush on beforeunload if replay is not available', async () => {
    vi.mocked(Sentry.getReplay).mockReturnValue(undefined);

    await import('./instrument');
    window.dispatchEvent(new Event('beforeunload'));

    expect(Sentry.flush).toHaveBeenCalledWith(2000);
  });
});
