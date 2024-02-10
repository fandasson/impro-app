import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: Tables<"questions">;
};
export const QuestionHeadline = ({ question }: Props) => {
    return <h2 className={"text-center text-2xl font-bold"}>{question.question}</h2>;
};
