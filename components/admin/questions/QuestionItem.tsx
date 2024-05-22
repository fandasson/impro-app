import { Eye, EyeOff, HelpCircle, Pencil, ProjectorIcon, SmartphoneIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { QuestionWithPool } from "@/api/types.api";

type Props = QuestionWithPool;
export const QuestionItem = (props: Props) => {
    const { id, name, state, audience_visibility, questions_pool: pool } = props;

    let stateIcon: ReactNode | null = null;
    switch (state) {
        case "draft":
        case "answered":
            stateIcon = <EyeOff />;
            break;
        case "active":
            stateIcon = <Pencil className={"stroke-destructive"} />;
            break;
        case "locked":
            stateIcon = <Eye className={"stroke-destructive"} />;
            break;
    }

    let audienceVisibilityIcon: ReactNode | null = null;
    switch (audience_visibility) {
        case "hidden":
            audienceVisibilityIcon = <EyeOff />;
            break;
        case "question":
            audienceVisibilityIcon = <HelpCircle className={"stroke-destructive"} />;
            break;
        case "results":
            audienceVisibilityIcon = <Eye className={"stroke-destructive"} />;
            break;
    }

    return (
        <Link href={`/admin/questions/${id}/view`} className={"grid grid-cols-7 gap-2 rounded border px-3.5 py-3"}>
            <strong className={"col-span-4"}>{name}</strong>
            <span>{pool?.name}</span>
            <div className={"flex items-center justify-end"}>
                <SmartphoneIcon size={28} className={"mr-4"} />
                {stateIcon}
            </div>
            <div className={"flex items-center justify-end"}>
                <ProjectorIcon size={28} className={"mr-4"} />
                {audienceVisibilityIcon}
            </div>
        </Link>
    );
};
