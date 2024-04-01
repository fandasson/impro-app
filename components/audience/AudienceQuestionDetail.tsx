import { useEffect, useState } from "react";

import { fetchActiveQuestion } from "@/api/questions.api";
import { Question } from "@/api/types.api";
import { QuestionHeadline } from "@/components/audience/QuestionHeadline";
import { Timer } from "@/components/audience/Timer";
import { QuestionAnswers } from "@/components/audience/answers/QuestionAnswers";

type Props = {
    performanceId: number;
};
export const AudienceQuestionDetail = ({ performanceId }: Props) => {
    const [question, setQuestion] = useState<Question | null>(null);

    useEffect(() => {
        fetchActiveQuestion(performanceId).then((response) => setQuestion(response.data));
    }, [performanceId]);

    if (!question) {
        return null;
    }

    const showTimer = question.time_limit > 0 && question.finish_at !== null;
    return (
        <div className={"flex flex-col items-center gap-8"}>
            <QuestionHeadline question={question} />
            {showTimer && <Timer />}
            {question.present_answers && <QuestionAnswers questionId={question.id} />}
        </div>
    );
};