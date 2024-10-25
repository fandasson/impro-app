import { Character, MatchAnswer, Player, VoteAnswer, VotedPlayer } from "@/api/types.api";

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

type MatchesResult = {
    players: { playerId: number; name: string; count: number }[];
};
export const countMatches = (
    players: Player[],
    characters: Character[],
    answers: MatchAnswer[],
): Record<number, MatchesResult> => {
    return characters.reduce(
        (collector, character) => {
            collector[character.id] = {
                players: players
                    .map((player) => ({
                        playerId: player.id,
                        name: player.name,
                        count: answers.filter(
                            (answer) => answer.player_id === player.id && answer.character_id === character.id,
                        ).length,
                    }))
                    .sort((a, b) => b.count - a.count),
            };

            return collector;
        },
        {} as Record<number, MatchesResult>,
    );
};
