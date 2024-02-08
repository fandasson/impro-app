import { ReactNode } from "react";

import "@/styles/globals.css";

export default function ScreenLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <main className={"container flex h-screen items-center justify-center"}>{children}</main>;
}
