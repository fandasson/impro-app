"use client";

import { useEffect, useState } from "react";

import { getPlayerPhotos } from "@/api/photos.api";
import { fetchQuestionPlayers } from "@/api/questions.api";
import { submitVoteAnswer } from "@/api/submit-answer";
import { PlayerWithPhotos, Question } from "@/api/types.api";
import { PlayerCard } from "@/components/users/questions/PlayersVotingQuestion/PlayerCard";
import { storeAnswer, useUsersStore } from "@/store/users.store";
import { cn } from "@/utils/styling.utils";

type Props = {
    question: Question;
};

export const PlayersVotingQuestion = ({ question }: Props) => {
    const [players, setPlayers] = useState<PlayerWithPhotos[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<number>();
    const answered = useUsersStore((state) => state.answers[question.id] as number | undefined);

    useEffect(() => {
        fetchQuestionPlayers(question.id).then((response) => {
            const newPlayers = response.map((player) => {
                const photo = getPlayerPhotos(player.id);
                return {
                    ...player,
                    photos: photo,
                } as PlayerWithPhotos;
            });
            setPlayers(newPlayers);
        });
    }, [question.id]);

    useEffect(() => {
        if (answered && !selectedPlayer) {
            setSelectedPlayer(answered);
        }
    }, [answered, selectedPlayer]);

    const handleSubmit = async (playerId: number) => {
        setSelectedPlayer(playerId);
        await submitVoteAnswer({
            question_id: question.id,
            player_id: playerId,
        }).then(() => {
            storeAnswer(question.id, playerId);
        });
    };

    const rows = Math.ceil(players.length / 2);

    return (
        <div className={cn("grid grid-cols-2 items-center justify-center gap-x-2 gap-y-4", `grid-rows-${rows}`)}>
            {players &&
                players.map((player) => (
                    <PlayerCard
                        player={{ ...player, count: 0 }}
                        key={player.id}
                        hideResults={true}
                        selected={selectedPlayer === player.id}
                        onClick={() => handleSubmit(player.id)}
                        heightFraction={rows}
                    />
                ))}
        </div>
    );
};
