import { useEffect, useState } from "react";

import { fetchAnswers } from "@/api/answers.api";
import { Badge } from "@/components/ui/Badge";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    questionId: number;
};
export const QuestionAnswers = ({ questionId }: Props) => {
    const [answers, setAnswers] = useState<Tables<"answers">[] | null>(null);

    useEffect(() => {
        fetchAnswers(questionId).then((response) => setAnswers(response.data));
    }, [questionId]);

    if (!answers) {
        return null;
    }

    return (
        <div className={"flex flex-wrap gap-4"}>
            {answers.map((answer) => (
                <Badge className={"text-md"} key={answer.id} variant="outline">
                    {answer.value}
                </Badge>
            ))}
        </div>
    );
};
