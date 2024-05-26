"use client";

import { useEffect, useState } from "react";

import { fetchPoolVoteAnswers } from "@/api/answers.api";
import { fetchAvailablePlayers } from "@/api/performances.api";
import { getPlayerPhotos } from "@/api/photos.api";
import { PlayerWithPhotos, VoteAnswer } from "@/api/types.api";
import { VotingAnswers } from "@/components/audience/answers/VotingAnswers";
import { countVotesForPlayers } from "@/utils/answers.utils";

type Props = {
    poolId: number;
    performanceId: number;
};

export const PoolVotingAnswers = ({ poolId, performanceId }: Props) => {
    const [players, setPlayers] = useState<PlayerWithPhotos[]>([]);
    const [answers, setAnswers] = useState<VoteAnswer[]>([]);

    useEffect(() => {
        if (performanceId) {
            fetchAvailablePlayers(performanceId).then((response) => {
                if (!response) {
                    return;
                }

                const newPlayers = response.map((player) => {
                    const photo = getPlayerPhotos(player.id);
                    return {
                        ...player,
                        photos: photo,
                    } as PlayerWithPhotos;
                });
                setPlayers(newPlayers);
            });
        }

        if (poolId) {
            fetchPoolVoteAnswers(poolId).then((response) => {
                if (!response) {
                    return;
                }
                setAnswers(response.data ?? []);
            });
        }
    }, [poolId, performanceId]);

    const sortedPlayers = countVotesForPlayers<PlayerWithPhotos>(players, answers ?? []);

    return <VotingAnswers players={sortedPlayers} hideResults={false} />;
};
