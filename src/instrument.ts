import * as Sentry from '@sentry/react';

// ponytail: Sentry initialized minimal for SPA. React Router browser tracing is skipped (YAGNI).
let sessionId = sessionStorage.getItem('sentry_session_id');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  sessionStorage.setItem('sentry_session_id', sessionId);
}

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (!sentryDsn) {
  console.error(
    '[Sentry] VITE_SENTRY_DSN is not set. ' +
    'Telemetry is disabled. Add this variable to your Vercel environment variables.'
  );
}

Sentry.init({
  dsn: sentryDsn,
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.feedbackIntegration({
      autoInject: false,
      colorScheme: 'system',
      buttonLabel: 'Report an Issue',
      submitButtonLabel: 'Submit Issue',
      formTitle: 'Report an Issue',
    }),
    Sentry.consoleLoggingIntegration({
      levels: ['log', 'warn', 'error'],
    }),
    Sentry.globalHandlersIntegration({
      onerror: true,
      onunhandledrejection: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
});

Sentry.setTag('session_id', sessionId);

window.addEventListener('beforeunload', () => {
  const replay = Sentry.getReplay && Sentry.getReplay();
  if (replay && 'flush' in replay) {
    (replay as unknown as { flush: () => void }).flush();
  } else {
    Sentry.flush(2000);
  }
});
