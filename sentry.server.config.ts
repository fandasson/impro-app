import * as Sentry from "@sentry/nextjs";
import { SupabaseClient } from "@supabase/supabase-js";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    tracesSampleRate: 0.2,

    enabled: process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_SENTRY_DEBUG === "true",

    integrations: [Sentry.supabaseIntegration({ supabaseClient: SupabaseClient })],
});
