import React from "react";

import { useAdminStore } from "@/store/admin.store";

type Props = {
    uniqueUsers?: boolean;
};
export const AnswersHeadline = ({ uniqueUsers }: Props) => {
    const answersCount = useAdminStore((state) => {
        if (uniqueUsers) {
            const uniqueUserIds = new Set(state.answers.map((answer) => answer.user_id));
            return uniqueUserIds.size;
        }
        return state.answers.length;
    });

    return (
        <h3 className={"mb-4 font-medium not-italic text-gray-400"}>
            {answersCount} {answersCount === 1 ? "Odpověď" : answersCount < 5 ? "Odpovědi" : "Odpovědí"}
        </h3>
    );
};
