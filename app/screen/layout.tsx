import { ReactNode } from "react";

import "@/styles/globals.css";
import { Container } from "@/components/ui/Container";

export default function ScreenLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <Container>{children}</Container>;
}
