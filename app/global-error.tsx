"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Catches errors thrown inside the root layout (app/layout.tsx).
// Must include its own <html> and <body> tags.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="cs">
            <body>
                <div
                    style={{
                        display: "flex",
                        minHeight: "100vh",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: "2rem",
                        textAlign: "center",
                        fontFamily: "sans-serif",
                    }}
                >
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Ne každý vtip je k zasmání</h2>
                    <p style={{ fontSize: "0.875rem", opacity: 0.6 }}>
                        A tohle taky není k smíchu. Ale něco tu nefunguje.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            marginTop: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.375rem",
                            backgroundColor: "#fff",
                            color: "#000",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            border: "none",
                        }}
                    >
                        Tlačítko, co asi nepomůže
                    </button>
                </div>
            </body>
        </html>
    );
}
