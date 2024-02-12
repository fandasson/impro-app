import React, { useEffect, useState } from "react";

import { fetchActiveQuestion } from "@/api/questions.api";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { NoQuestion } from "@/components/users/NoQuestion";
import { TextQuestion } from "@/components/users/questions/TextQuestion";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    // question: Tables<"questions">;
    performanceId: number;
};

export const Questions = ({ performanceId }: Props) => {
    let component: React.JSX.Element | null = null;
    const [question, setQuestion] = useState<Tables<"questions"> | null>(null);

    useEffect(() => {
        fetchActiveQuestion(performanceId).then((response) => setQuestion(response.data));
    }, [performanceId]);

    if (!question) {
        return <NoQuestion />;
    }

    switch (question.type) {
        case "text":
            component = <TextQuestion questionId={question.id} />;
            break;
    }

    return (
        <MobileContainer className={""}>
            <div className={"grid grid-flow-col gap-4"}>
                <div>{question.question}</div>
                <div>?</div>
            </div>
            {component}
        </MobileContainer>
    );
};
