import { useEffect, useState } from "react";

import { fetchActiveQuestion } from "@/api/questions.api";
import { QuestionHeadline } from "@/components/audience/QuestionHeadline";
import { Timer } from "@/components/audience/Timer";
import { MatchQuestionAnswers } from "@/components/audience/answers/MatchAnswer";
import { QuestionAnswers } from "@/components/audience/answers/QuestionAnswers";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performanceId: number;
};
export const AudienceQuestionDetail = ({ performanceId }: Props) => {
    const [question, setQuestion] = useState<Tables<"questions"> | null>(null);

    useEffect(() => {
        fetchActiveQuestion(performanceId).then((response) => setQuestion(response.data));
    }, [performanceId]);

    // @ts-ignore
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("question-channel")
            .on<Tables<"questions">>(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "questions",
                    filter: `id=eq.${question?.id || -1}`,
                },
                (payload) => {
                    setQuestion(payload.new);
                },
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [question]);

    if (!question) {
        return null;
    }

    let component = null;
    switch (question.type) {
        case "text":
            component = <QuestionAnswers questionId={question.id} />;
            break;
        case "match":
            component = <MatchQuestionAnswers questionId={question.id} />;
            break;
    }

    const showTimer = question.time_limit > 0 && question.finish_at !== null;
    return (
        <div className={"flex flex-col items-center gap-8"}>
            <QuestionHeadline question={question} />
            {showTimer && <Timer />}
            {question.present_answers && component}
        </div>
    );
};
