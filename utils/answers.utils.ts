import { Player, VoteAnswer, VotedPlayer } from "@/api/types.api";

export const countVotesForPlayers = <T extends Player>(players: T[], answers: VoteAnswer[]) => {
    const sortedPlayers = players
        .map((player) => {
            return {
                ...player,
                count: answers.filter((answer) => answer.player_id === player.id).length,
            };
        })
        .sort((a, b) => b.count - a.count);
    return sortedPlayers as VotedPlayer<T>[];
};
