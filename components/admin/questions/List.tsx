import { PropsWithChildren } from "react";

export const List = ({ children }: PropsWithChildren) => <div className={"flex flex-col gap-8"}>{children}</div>;
