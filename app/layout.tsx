import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ReactNode } from "react";

import { cn } from "@/utils/styling.utils";

import "@/styles/globals.css";

const dmSans = DM_Sans({
    subsets: ["latin", "latin-ext"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "IMPROvariace life",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="cs">
            <body className={cn("dark min-h-screen bg-background font-sans antialiased", dmSans.variable)}>
                {children}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
