"use client";

import { ReactNode } from "react";

import { UserProvider } from "@/components/audience/UserContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <UserProvider>{children}</UserProvider>;
}
