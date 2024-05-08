"use client";

import { useEffect, useState } from "react";

import { fetchMatchQuestionPlayers } from "@/api/questions.api";
import { submitVoteAnswer } from "@/api/submit-answer";
import { Player } from "@/api/types.api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: Tables<"questions">;
};

export const PlayerPickQuestion = ({ question }: Props) => {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<string>();

    useEffect(() => {
        fetchMatchQuestionPlayers(question.id).then((response) => setPlayers(response));
    }, [question.id]);

    const handleSubmit = async (value: string) => {
        if (value) {
            const playerId = parseInt(value);
            setSelectedPlayer(`${playerId}`);
            await submitVoteAnswer({
                question_id: question.id,
                player_id: playerId,
            });
        }
    };

    return (
        <>
            <ToggleGroup
                type="single"
                size={"lg"}
                value={selectedPlayer}
                onValueChange={handleSubmit}
                className={"grid grid-cols-1 gap-4"}
            >
                {players &&
                    players.map((player) => (
                        <ToggleGroupItem
                            key={player.id}
                            value={`${player.id}`}
                            className={"border p-8 text-xl font-medium"}
                        >
                            {player.name}
                        </ToggleGroupItem>
                    ))}
            </ToggleGroup>
        </>
    );
};
