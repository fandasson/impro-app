import { ProjectorIcon, SmartphoneIcon } from "lucide-react";
import Link from "next/link";

import type { QuestionWithPool } from "@/api/types.api";
import { cn } from "@/utils/styling.utils";

type Props = {
    question: QuestionWithPool;
    selected: boolean;
};

export const QuestionSidebarRow = ({ question, selected }: Props) => {
    const userActive = question.state === "active" || question.state === "locked";
    const audienceVisible = question.audience_visibility !== "hidden";

    return (
        <Link
            href={`/admin/questions/${question.id}/view`}
            aria-current={selected ? "page" : undefined}
            className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                selected ? "bg-[var(--amber-dim)]" : "hover:bg-accent",
            )}
        >
            {selected && <span className={"absolute inset-y-2 left-0 w-0.5 rounded-r bg-amber"} aria-hidden />}
            <span className={cn("flex-1 truncate text-sm", selected ? "font-semibold" : "font-medium")}>
                {question.name}
            </span>
            <span className={"flex shrink-0 items-center gap-2"}>
                <SmartphoneIcon
                    size={14}
                    className={userActive ? "text-amber" : "text-muted-foreground"}
                    aria-label={"Diváck"}
                />
                <ProjectorIcon
                    size={14}
                    className={audienceVisible ? "text-amber" : "text-muted-foreground"}
                    aria-label={"Diváci / projekce"}
                />
            </span>
        </Link>
    );
};
