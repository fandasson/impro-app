import { MatchQuestionAnswers } from "@/components/audience/answers/MatchAnswer";
import { PlayersVotingAnswers } from "@/components/audience/answers/PlayersVotingAnswers";
import { TextQuestionAnswers } from "@/components/audience/answers/TextQuestionAnswers";
import { Question } from "@/components/audience/questions/Question";
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
        switch (question.type) {
            case "voting":
            case "player-pick":
                return <PlayersVotingAnswers questionId={question.id} />;
            default:
                return <Question question={question} />;
        }
    }

    switch (question.type) {
        case "text":
            return <TextQuestionAnswers questionId={question.id} />;
        case "voting":
        case "player-pick":
            return <PlayersVotingAnswers questionId={question.id} hideResults={false} />;
        case "match":
            return <MatchQuestionAnswers questionId={question.id} />;
        default:
            return null;
    }
};
