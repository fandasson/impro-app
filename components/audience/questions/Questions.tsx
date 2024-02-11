import React from "react";

import { TextQuestion } from "@/components/audience/questions/TextQuestion";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: Tables<"questions">;
};

export const Questions = ({ question }: Props) => {
    let component: React.JSX.Element | null = null;

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
