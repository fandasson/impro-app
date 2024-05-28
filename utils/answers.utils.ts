import { Player, VoteAnswer, VotedPlayer } from "@/api/types.api";

export const countVotesForPlayers = <T extends Player>(
    players: T[],
    answers: VoteAnswer[],
    hideResults: boolean = false,
) => {
    const extendedPlayers = players.map((player) => {
        const count = answers.filter((answer) => answer.player_id === player.id).length;
        return {
            ...player,
            count: hideResults ? 0 : count,
        };
    });

    if (hideResults) {
        return extendedPlayers as VotedPlayer<T>[];
    }

    const sortedPlayers =
        extendedPlayers.length > 2 ? extendedPlayers.sort((a, b) => b.count - a.count) : extendedPlayers;
    return sortedPlayers as VotedPlayer<T>[];
};
