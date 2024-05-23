"use client";

import { useEffect, useState } from "react";

import { fetchPoolVoteAnswers } from "@/api/answers.api";
import { fetchAvailablePlayers } from "@/api/performances.api";
import { Player, VoteAnswer } from "@/api/types.api";
import { VotingAnswers } from "@/components/audience/answers/VotingAnswers";
import { countVotesForPlayers } from "@/utils/answers.utils";

type Props = {
    poolId: number;
    performanceId: number;
};

export const PoolVotingAnswers = ({ poolId, performanceId }: Props) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [answers, setAnswers] = useState<VoteAnswer[]>([]);

    useEffect(() => {
        if (performanceId) {
            fetchAvailablePlayers(performanceId).then((response) => {
                if (!response) {
                    return;
                }
                setPlayers(response);
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

    const sortedPlayers = countVotesForPlayers(players, answers ?? []);

    return <VotingAnswers players={sortedPlayers} />;
};
