import { PropsWithChildren } from "react";

import { cn } from "@/utils/styling.utils";

type Props = PropsWithChildren & React.HTMLAttributes<"div">;
export const TabletContainer = ({ children, className }: Props) => {
    return <main className={cn("container flex h-screen flex-col gap-6 p-6", className)}>{children}</main>;
};
