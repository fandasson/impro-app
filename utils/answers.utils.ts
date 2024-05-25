import { Player, VoteAnswer, VotedPlayer } from "@/api/types.api";

export const countVotesForPlayers = <T extends Player>(
    players: T[],
    answers: VoteAnswer[],
    hideResults: boolean = false,
) => {
    const sortedPlayers = players
        .map((player) => {
            const count = answers.filter((answer) => answer.player_id === player.id).length;
            return {
                ...player,
                count: hideResults ? 0 : count,
            };
        })
        .sort((a, b) => b.count - a.count);
    return sortedPlayers as VotedPlayer<T>[];
};
