import { Eye, EyeOff, UserCheck } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { QuestionWithPool } from "@/api/types.api";

type Props = QuestionWithPool;
export const QuestionItem = (props: Props) => {
    const { id, name, state, questions_pool: pool } = props;

    let stateIcon: ReactNode | null = null;
    switch (state) {
        case "draft":
            stateIcon = <EyeOff />;
            break;
        case "active":
            stateIcon = <Eye className={"stroke-destructive"} />;
            break;
        case "answered":
            stateIcon = <UserCheck />;
            break;
    }

    return (
        <Link href={`/admin/questions/${id}`} className={"flex justify-between rounded border px-3.5 py-3"}>
            <strong>{name}</strong>
            <span>{pool?.name}</span>
            {stateIcon}
        </Link>
    );
};
