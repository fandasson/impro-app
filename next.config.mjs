import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "meudxrcsglqhfsylqmhs.supabase.co",
                port: "",
            },
            {
                protocol: "https",
                hostname: "www.improvariace.cz",
                pathname: "/media/**",
                port: "",
            },
        ],
    },
};

export default withSentryConfig(nextConfig, {
    // Silent Sentry CLI output during builds
    silent: !process.env.CI,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Upload source maps to Sentry for readable stack traces
    // Requires SENTRY_AUTH_TOKEN env var if you want source map uploads
    widenClientFileUpload: true,
});
