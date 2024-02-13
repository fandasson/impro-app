import { Eye, EyeOff, UserCheck } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { Tables } from "@/utils/supabase/entity.types";

type Props = Tables<"questions">;
export const QuestionItem = (props: Props) => {
    const { id, name, state } = props;

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
            {stateIcon}
        </Link>
    );
};
