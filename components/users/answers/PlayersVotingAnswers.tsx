"use client";
import { useEffect, useState } from "react";

import { fetchVoteAnswers } from "@/api/answers.api";
import { getPlayerPhotos } from "@/api/photos.api";
import { fetchQuestion } from "@/api/questions.api";
import { PlayerWithPhotos, VoteAnswer } from "@/api/types.api";
import { PlayerCard } from "@/components/users/questions/PlayersVotingQuestion/PlayerCard";
import { setLoading } from "@/store/users.store";
import { countVotesForPlayers } from "@/utils/answers.utils";
import { cn } from "@/utils/styling.utils";

type Props = {
    questionId: number;
    hideResults?: boolean;
};
export const PlayersVotingAnswers = ({ questionId, hideResults = true }: Props) => {
    const [answers, setAnswers] = useState<VoteAnswer[]>([]);
    const [players, setPlayers] = useState<PlayerWithPhotos[]>([]);

    useEffect(() => {
        setLoading(true);
        const _fetchAnswers = fetchVoteAnswers(questionId).then((response) => setAnswers(response.data ?? []));
        const _fetchQuestion = fetchQuestion(questionId).then((response) => {
            const players = response.data?.players ?? [];
            const newPlayers = players.map((player) => {
                const photo = getPlayerPhotos(player.id);
                return {
                    ...player,
                    photos: photo,
                } as PlayerWithPhotos;
            });
            setPlayers(newPlayers);
        });
        Promise.all([_fetchAnswers, _fetchQuestion]).finally(() => setLoading(false));
    }, [questionId]);

    const sortedPlayers = countVotesForPlayers(players, answers);

    const rows = Math.ceil(sortedPlayers.length / 2);
    return (
        <div className={cn("grid grid-cols-2 items-center justify-center gap-x-2 gap-y-4", `grid-rows-${rows}`)}>
            {sortedPlayers &&
                sortedPlayers.map((player) => (
                    <PlayerCard player={player} key={player.id} hideResults={false} heightFraction={rows} />
                ))}
        </div>
    );
};
