import { fetchPoolVoteAnswers } from "@/api/answers.api";
import { fetchAvailablePlayers } from "@/api/performances.api";
import { VotingAnswers } from "@/components/admin/answers/VotingAnswers";
import { countVotesForPlayers } from "@/utils/answers.utils";

type Props = {
    poolId: number;
    performanceId: number;
};

export const PoolVotingAnswers = async ({ poolId, performanceId }: Props) => {
    const players = await fetchAvailablePlayers(performanceId);
    const { data: answers } = await fetchPoolVoteAnswers(poolId);
    const sortedPlayers = countVotesForPlayers(players, answers ?? []);

    return <VotingAnswers players={sortedPlayers} />;
};
