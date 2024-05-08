import { useEffect, useState } from "react";

import { fetchVoteAnswers } from "@/api/answers.api";
import { fetchQuestion } from "@/api/questions.api";
import { Player, VoteAnswer } from "@/api/types.api";
import { countVotesForPlayers } from "@/utils/answers.utils";
import { cn } from "@/utils/styling.utils";

type Props = {
    questionId: number;
};

export const PlayerPickAnswers = ({ questionId }: Props) => {
    const [answers, setAnswers] = useState<VoteAnswer[] | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const _fetchResults = fetchVoteAnswers(questionId).then((response) => setAnswers(response.data));
        const _fetchQuestion = fetchQuestion(questionId).then((response) => {
            setPlayers(response.data?.players || []);
        });
        Promise.all([_fetchResults, _fetchQuestion]);
    }, [questionId]);

    if (!answers || !players) {
        return null;
    }

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
