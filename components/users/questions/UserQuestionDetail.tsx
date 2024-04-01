import React, { useEffect, useState } from "react";

import { fetchActiveQuestion } from "@/api/questions.api";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { NoQuestion } from "@/components/users/NoQuestion";
import { MatchQuestion } from "@/components/users/questions/MatchQuestion";
import { TextQuestion } from "@/components/users/questions/TextQuestion";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    // question: Tables<"questions">;
    performanceId: number;
};

export const UserQuestionDetail = ({ performanceId }: Props) => {
    let component: React.JSX.Element | null = null;
    const [question, setQuestion] = useState<Tables<"questions"> | null>(null);

    useEffect(() => {
        fetchActiveQuestion(performanceId).then((response) => setQuestion(response.data));
    }, [performanceId]);

    // @ts-ignore
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(CHANNEL_DATABASE)
            .on<Tables<"questions">>(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "questions",
                    filter: "performance_id=eq." + performanceId,
                },
                (payload) => {
                    const newQuestion = payload.new;
                    if (newQuestion?.state === "active") {
                        setQuestion(newQuestion);
                    } else {
                        setQuestion(null);
                    }
                },
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [performanceId]);

    if (!question) {
        return <NoQuestion />;
    }

    switch (question.type) {
        case "text":
            component = <TextQuestion questionId={question.id} />;
            break;
        case "match":
            component = <MatchQuestion question={question} />;
            break;
    }

    return (
        <MobileContainer className={""}>
            <div className={"grid grid-flow-col gap-4"}>
                <h2 className={"text-lg font-medium"}>{question.question}</h2>
                {/*<div>time</div>*/}
            </div>
            {component}
        </MobileContainer>
    );
};
