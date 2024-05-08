import { useEffect, useState } from "react";

import { fetchTextAnswers } from "@/api/answers.api";
import { TextAnswer } from "@/api/types.api";
import { Badge } from "@/components/ui/Badge";

type Props = {
    questionId: number;
};
export const TextQuestionAnswers = ({ questionId }: Props) => {
    const [answers, setAnswers] = useState<TextAnswer[] | null>(null);

    useEffect(() => {
        fetchTextAnswers(questionId).then((response) => setAnswers(response.data));
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
