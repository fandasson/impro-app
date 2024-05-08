import React from "react";

import { useAdminStore } from "@/store/admin.store";

export const AnswersHeadline = () => {
    const answersCount = useAdminStore((state) => state.answers.length);

    return (
        <h3 className={"mb-4 font-medium not-italic text-gray-400"}>
            {answersCount} {answersCount === 1 ? "Odpověď" : answersCount < 5 ? "Odpovědi" : "Odpovědí"}
        </h3>
    );
};
