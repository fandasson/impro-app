import { fetchAnswers } from "@/api/answers.api";
import { Badge } from "@/components/ui/Badge";

type Props = {
    questionId: number;
};
export const TextAnswers = async ({ questionId }: Props) => {
    const { data: answers } = await fetchAnswers(questionId);

    if (!answers) {
        return null;
    }

    return (
        <div className={"flex flex-wrap gap-4"}>
            {answers.map((answer) => (
                <Badge className={"text-md px-3.5 py-2"} key={answer.id} variant="outline">
                    {answer.value}
                </Badge>
            ))}
        </div>
    );
};
