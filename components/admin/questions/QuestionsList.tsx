import { PropsWithChildren } from "react";

export const QuestionsList = ({ children }: PropsWithChildren) => (
    <div className={"flex flex-col gap-8"}>{children}</div>
);
