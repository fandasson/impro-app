import React from "react";

import { fetchAnswers } from "@/api/answers.api";
import { TextAnswers } from "@/components/admin/answers/TextAnswers";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: Tables<"questions">;
};

export const Answers = async ({ question }: Props) => {
    const { data: answers } = await fetchAnswers(question.id);
    let component: React.JSX.Element | null = null;

    switch (question.type) {
        case "text":
            component = <TextAnswers questionId={question.id} answers={answers ?? []} />;
            break;
    }

    const length = answers?.length ?? 0;
    return (
        <>
            <h3 className={"mb-4 font-medium not-italic text-gray-400"}>
                {length} {length === 1 ? "Odpověď" : length < 5 ? "Odpovědi" : "Odpovědí"}
            </h3>
            {component}
        </>
    );
};
