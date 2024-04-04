import { useEffect, useState } from "react";

import { fetchMatchingQuestionResults } from "@/api/answers.api";
import { fetchQuestion } from "@/api/questions.api";
import { MatchAnswerResults, Player } from "@/api/types.api";
import { setLoading, useStore } from "@/store";

type Props = {
    questionId: number;
};

export const MatchQuestionAnswers = ({ questionId }: Props) => {
    const [answers, setAnswers] = useState<MatchAnswerResults[] | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const isLoading = useStore((state) => state.loading);

    useEffect(() => {
        setLoading(true);
        const _fetchResults = fetchMatchingQuestionResults(questionId).then((response) => setAnswers(response));
        const _fetchQuestion = fetchQuestion(questionId).then((response) => {
            setPlayers(response.data?.players || []);
        });
        Promise.all([_fetchResults, _fetchQuestion]).finally(() => setLoading(false));
    }, [questionId]);

    if (!answers || !players || isLoading) {
        return null;
    }

    const renderAnswers = (playerId: number) => {
        const playersAnswers = answers.filter((answer) => answer.player_id === playerId);
        return playersAnswers.map((answer, index) => {
            return (
                <div key={index} className={"flex justify-between gap-4"}>
                    <div>{answer.value}</div>
                    <div className={"text-right"}>{answer.count}</div>
                </div>
            );
        });
    };

    return (
        <div className={"flex gap-8"}>
            {players &&
                players.map((player) => {
                    return (
                        <div key={player.id}>
                            <h2 className={"text-lg font-medium"}>{player.name}</h2>
                            {renderAnswers(player.id)}
                        </div>
                    );
                })}
        </div>
    );
};
