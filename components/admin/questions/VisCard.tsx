import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
    icon: ReactNode;
    title: string;
}>;

export const VisCard = ({ icon, title, children }: Props) => {
    return (
        <div className={"flex flex-col gap-3 rounded-xl border border-border bg-card p-4"}>
            <div
                className={
                    "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                }
            >
                {icon}
                <span>{title}</span>
            </div>
            {children}
        </div>
    );
};
