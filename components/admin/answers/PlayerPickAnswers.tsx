"use client";
import { Answer, Player } from "@/api/types.api";
import { cn } from "@/utils/styling.utils";

type Props = {
    players: Player[];
    answers: Answer[];
};
export const PlayerPickAnswers = ({ players, answers }: Props) => {
    const sortedPlayers = players
        .map((player) => {
            return {
                ...player,
                count: answers.filter((answer) => parseInt(answer.value) === player.id).length,
            };
        })
        .sort((a, b) => b.count - a.count);

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
