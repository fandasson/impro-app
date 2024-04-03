import { PropsWithChildren } from "react";

import { cn } from "@/utils/styling.utils";

type Props = PropsWithChildren & React.HTMLAttributes<"div">;
export const CenteredContainer = ({ children, className }: Props) => {
    return <main className={cn("container flex h-screen items-center justify-center", className)}>{children}</main>;
};
