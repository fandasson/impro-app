import { ReactNode } from "react";

import { CenteredContainer } from "@/components/ui/layout/CenteredContainer";

export default function ScreenLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <CenteredContainer className={"w-screen bg-black"}>{children}</CenteredContainer>;
}
