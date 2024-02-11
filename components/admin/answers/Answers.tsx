import { TextAnswers } from "@/components/admin/answers/TextAnswers";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: Tables<"questions">;
};

export const Answers = ({ question }: Props) => {
    switch (question.type) {
        case "text":
            return <TextAnswers questionId={question.id} />;
        default:
            return null;
    }
};
