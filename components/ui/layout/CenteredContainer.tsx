import { PropsWithChildren } from "react";

export const CenteredContainer = ({ children }: PropsWithChildren) => {
    return <main className={"container flex h-screen items-center justify-center"}>{children}</main>;
};
