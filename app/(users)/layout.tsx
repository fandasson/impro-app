import { ReactNode } from "react";

import { AuthUser } from "@/components/users/AuthUser";

export default function UserLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <AuthUser>{children}</AuthUser>;
}
