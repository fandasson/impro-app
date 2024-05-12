"use client";
import { Player } from "@/api/types.api";
import { useVoteAnswers } from "@/hooks/admin.hooks";
import { countVotesForPlayers } from "@/utils/answers.utils";
import { cn } from "@/utils/styling.utils";

type Props = {
    players: Player[];
    summary: boolean;
    poolId: number | null;
    questionId: number;
};

export const PlayersVotingAnswers = ({ players, questionId, poolId, summary = false }: Props) => {
    const answers = useVoteAnswers(questionId, summary, poolId);
    const sortedPlayers = countVotesForPlayers(players, answers);

    return (
        <div className={"flex flex-col gap-8 text-2xl"}>
            {sortedPlayers &&
                sortedPlayers.map((player, index) => {
                    return (
                        <div
                            key={player.id}
                            className={cn(
                                "flex justify-between gap-16 rounded-md p-4",
                                index === 0 ? "border" : undefined,
                            )}
                        >
                            <h2 className={"font-medium"}>{player.name}</h2>
                            {player.count}
                        </div>
                    );
                })}
        </div>
    );
};