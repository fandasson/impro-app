import { fetchAnswers } from "@/api/answers.api";
import { TextAnswers } from "@/components/admin/answers/TextAnswers";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: Tables<"questions">;
};

export const Answers = async ({ question }: Props) => {
    const { data: answers } = await fetchAnswers(question.id);

    switch (question.type) {
        case "text":
            return <TextAnswers questionId={question.id} answers={answers ?? []} />;
        default:
            return null;
    }
};
