import { Question } from "@/api/types.api";
import { QuestionHeadline } from "@/components/audience/questions/QuestionHeadline";

type Props = {
    question: Question;
};

const _Question = ({ question }: Props) => {
    return (
        <div className={"flex flex-col items-center gap-8"}>
            <QuestionHeadline question={question} />
        </div>
    );
};
export { _Question as Question };
