import { fetchQuestionOptions } from "@/api/questions.api";
import { QuestionWithPlayersAndCharacters } from "@/api/types.api";
import { Badge } from "@/components/ui/Badge";

type Props = {
    question: QuestionWithPlayersAndCharacters;
};
export const QuestionOptions = async ({ question }: Props) => {
    if (question.type !== "options") {
        return null;
    }

    const options = await fetchQuestionOptions(question.id);

    return (
        <div>
            <h3 className={"text-lg font-medium"}>Možnosti</h3>
            <div className={"flex gap-3"}>
                {options?.map((option) => (
                    <Badge
                        key={option.id}
                        className={"block bg-zinc-800 text-zinc-100"}
                        dangerouslySetInnerHTML={{ __html: option.option ?? "" }}
                    />
                ))}
            </div>
        </div>
    );
};
