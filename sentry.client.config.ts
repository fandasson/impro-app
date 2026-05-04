import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Percentage of sessions to capture for session replay (0.0 – 1.0)
    replaysSessionSampleRate: 0.1,
    // Capture all sessions where an error occurred
    replaysOnErrorSampleRate: 1.0,

    // Percentage of transactions to send for performance monitoring
    tracesSampleRate: 0.2,

    // Only enable in production
    enabled: process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_SENTRY_DEBUG === "true",

    integrations: [
        Sentry.replayIntegration({
            // Mask all text content and block all media by default
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],
});
