import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

import { cn } from "@/utils/styling.utils";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

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
            <body className={cn("dark min-h-screen bg-background font-sans antialiased", inter.variable)}>
                {children}
            </body>
        </html>
    );
}
