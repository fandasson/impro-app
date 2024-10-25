import { fetchQuestionOptions } from "@/api/questions.api";
import { QuestionWithPlayersAndCharacters } from "@/api/types.api";

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
            {options?.map((option) => option.option).join(", ")}
        </div>
    );
};
