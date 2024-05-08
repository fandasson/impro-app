import { useEffect, useState } from "react";

import { fetchActiveOrLockedQuestion } from "@/api/questions.api";
import { Question } from "@/api/types.api";
import { QuestionHeadline } from "@/components/audience/QuestionHeadline";
import { MatchQuestionAnswers } from "@/components/audience/answers/MatchAnswer";
import { PlayersVotingAnswers } from "@/components/audience/answers/PlayersVotingAnswers";
import { TextQuestionAnswers } from "@/components/audience/answers/TextQuestionAnswers";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performanceId: number;
};
export const AudienceQuestionDetail = ({ performanceId }: Props) => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [questionId, setQuestionId] = useState<number | undefined>();

    useEffect(() => {
        fetchActiveOrLockedQuestion(performanceId).then((response) => {
            setQuestion(response.data);
            setQuestionId(response.data?.id);
        });
    }, [performanceId]);

    // @ts-ignore
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("audience-questions")
            .on<Tables<"questions">>(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "questions",
                    filter: `id=eq.${questionId || -1}`,
                },
                (payload) => {
                    if (["active", "locked"].includes(payload.new?.state)) {
                        setQuestion(payload.new);
                    } else {
                        setQuestion(null);
                    }
                },
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [questionId]);

    if (!question) {
        return <></>;
    }

    let component = null;
    switch (question.type) {
        case "text":
            component = <TextQuestionAnswers questionId={question.id} />;
            break;
        case "voting":
        case "player-pick":
            component = <PlayersVotingAnswers questionId={question.id} />;
            break;
        case "match":
            component = <MatchQuestionAnswers questionId={question.id} />;
            break;
    }

    return (
        <div className={"flex flex-col items-center gap-8"}>
            <QuestionHeadline question={question} />
            {question.present_answers && component}
        </div>
    );
};
