import { Player, VoteAnswer } from "@/api/types.api";

export const countVotesForPlayers = (players: Player[], answers: VoteAnswer[]) => {
    const sortedPlayers = players
        .map((player) => {
            return {
                ...player,
                count: answers.filter((answer) => answer.player_id === player.id).length,
            };
        })
        .sort((a, b) => b.count - a.count);
    return sortedPlayers;
};
