"use client";
import { Player } from "@/api/types.api";
import { VotingAnswers } from "@/components/admin/answers/VotingAnswers";
import { useVoteAnswers } from "@/hooks/admin.hooks";
import { countVotesForPlayers } from "@/utils/answers.utils";

type Props = {
    players: Player[];
    questionId: number;
};

export const PlayersVotingAnswers = ({ players, questionId }: Props) => {
    const answers = useVoteAnswers(questionId);
    const sortedPlayers = countVotesForPlayers(players, answers);

    return <VotingAnswers players={sortedPlayers} />;
};
