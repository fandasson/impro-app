"use client";
import { useEffect, useState } from "react";

import { fetchAnswers } from "@/api/answers.api";
import { fetchQuestion } from "@/api/questions.api";
import { Answer, Player } from "@/api/types.api";
import { setLoading } from "@/store/users.store";
import { cn } from "@/utils/styling.utils";

type Props = {
    questionId: number;
};
export const PlayerPickAnswers = ({ questionId }: Props) => {
    const [answers, setAnswers] = useState<Answer[] | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        setLoading(true);
        const _fetchResults = fetchAnswers(questionId).then((response) => setAnswers(response.data));
        const _fetchQuestion = fetchQuestion(questionId).then((response) => {
            setPlayers(response.data?.players || []);
        });
        Promise.all([_fetchResults, _fetchQuestion]).finally(() => setLoading(false));
    }, [questionId]);

    const sortedPlayers = players
        .map((player) => {
            return {
                ...player,
                count: answers ? answers.filter((answer) => parseInt(answer.value) === player.id).length : 0,
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
