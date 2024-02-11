import Link from "next/link";

import { Tables } from "@/utils/supabase/entity.types";

type Props = Tables<"questions">;
export const QuestionItem = (props: Props) => {
    const { id, name, state } = props;
    return (
        <Link href={`/admin/questions/${id}`} className={"flex justify-between rounded border px-3.5 py-3"}>
            <strong>{name}</strong>
        </Link>
    );
};
