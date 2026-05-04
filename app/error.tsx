"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-8 text-center text-white">
            <h2 className="text-xl font-semibold">Ne každý vtip je k zasmání</h2>
            <p className="text-sm text-white/60">A tohle taky není k smíchu. Ale něco tu nefunguje.</p>
            <button
                onClick={reset}
                className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
            >
                Tlačítko, co asi nepomůže
            </button>
        </div>
    );
}
