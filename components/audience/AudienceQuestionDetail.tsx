import { QuestionHeadline } from "@/components/audience/QuestionHeadline";
import { MatchQuestionAnswers } from "@/components/audience/answers/MatchAnswer";
import { PlayersVotingAnswers } from "@/components/audience/answers/PlayersVotingAnswers";
import { TextQuestionAnswers } from "@/components/audience/answers/TextQuestionAnswers";
import { useQuestion } from "@/hooks/audience.hooks";

type Props = {
    performanceId: number;
};
export const AudienceQuestionDetail = ({ performanceId }: Props) => {
    const question = useQuestion(performanceId);

    if (!question || question.audience_visibility === "hidden") {
        return null;
    }

    if (question.audience_visibility === "question") {
        return (
            <div className={"flex flex-col items-center gap-8"}>
                <QuestionHeadline question={question} />
            </div>
        );
    }

    // else question.audience_visibility === "results"

    switch (question.type) {
        case "text":
            return <TextQuestionAnswers questionId={question.id} />;
        case "voting":
        case "player-pick":
            return <PlayersVotingAnswers questionId={question.id} />;
        case "match":
            return <MatchQuestionAnswers questionId={question.id} />;
        default:
            return null;
    }
};
