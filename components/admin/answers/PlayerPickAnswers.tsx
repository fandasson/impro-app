"use client";
import { useEffect, useState } from "react";

import { Answer, QuestionWithPlayers } from "@/api/types.api";
import { cn } from "@/utils/styling.utils";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: QuestionWithPlayers;
    answers: Answer[];
};
export const PlayerPickAnswers = ({ question, answers: initialAnswers }: Props) => {
    const [answers, setAnswers] = useState(initialAnswers);

    useEffect(() => {
        setAnswers(initialAnswers);
    }, [initialAnswers]);

    // @ts-ignore
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("player-pick-answers")
            .on<Tables<"answers">>(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "answers",
                    filter: "question_id=eq." + question.id,
                },
                (payload) => setAnswers([...answers, payload.new]),
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [setAnswers, answers, question]);

    const sortedPlayers = question.players
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
