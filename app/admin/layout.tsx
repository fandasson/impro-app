import { ReactNode } from "react";

import { TabletContainer } from "@/components/ui/layout/TabletContainer";

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <TabletContainer>{children}</TabletContainer>;
}
