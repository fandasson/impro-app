"use client";
import { Player, VoteAnswer } from "@/api/types.api";
import { VotingAnswers } from "@/components/admin/answers/VotingAnswers";
import { useVoteAnswers } from "@/hooks/admin.hooks";
import { countVotesForPlayers } from "@/utils/answers.utils";

type Props = {
    players: Player[];
    questionId: number;
    initialAnswers?: VoteAnswer[];
};

export const PlayersVotingAnswers = ({ players, questionId, initialAnswers }: Props) => {
    const answers = useVoteAnswers(questionId, initialAnswers);
    const sortedPlayers = countVotesForPlayers(players, answers);

    return <VotingAnswers players={sortedPlayers} />;
};
