import { Question } from "@/api/types.api";

type Props = {
    question: Question;
};
export const QuestionHeadline = ({ question }: Props) => {
    return <h2 className={"text-center text-2xl font-bold"}>{question.question}</h2>;
};
