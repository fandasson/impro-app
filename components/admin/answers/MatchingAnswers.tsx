"use client";
import { Character, MatchAnswer, Player } from "@/api/types.api";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { useMatchingAnswers } from "@/hooks/admin.hooks";
import { countMatches } from "@/utils/answers.utils";

type Props = {
    players: Player[];
    characters: Character[];
    questionId: number;
    initialAnswers?: MatchAnswer[];
};

export const MatchingAnswers = ({ players, characters, questionId, initialAnswers }: Props) => {
    const answers = useMatchingAnswers(questionId, initialAnswers);
    const countedMatches = countMatches(players, characters, answers);

    if (characters.length === 0 || players.length === 0) {
        return null;
    }

    return (
        <Table>
            <TableBody>
                {characters.map((character) => {
                    const matchedPlayers = countedMatches[character.id].players;
                    return (
                        <TableRow key={character.id}>
                            <TableCell>{character.name}</TableCell>
                            {matchedPlayers.map((player) => {
                                if (player.count === 0) {
                                    return <TableCell key={player.playerId}>-</TableCell>;
                                }
                                return (
                                    <TableCell key={player.playerId}>
                                        {player.name} ({player.count})
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
