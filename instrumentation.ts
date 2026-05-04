export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
        await import("./sentry.edge.config");
    }
}

// Forwards Next.js server-side request errors to Sentry
export { captureRequestError as onRequestError } from "@sentry/nextjs";
