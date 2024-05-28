import { useEffect, useState } from "react";

import { fetchVoteAnswers } from "@/api/answers.api";
import { getPlayerPhotos } from "@/api/photos.api";
import { fetchQuestionPlayers } from "@/api/questions.api";
import { PlayerWithPhotos, VoteAnswer } from "@/api/types.api";
import { VotingAnswers } from "@/components/audience/answers/VotingAnswers";
import { VotingAnswersFinal } from "@/components/audience/answers/VotingAnswersFinal";
import { countVotesForPlayers } from "@/utils/answers.utils";

type Props = {
    questionId: number;
    hideResults?: boolean;
};

export const PlayersVotingAnswers = ({ questionId, hideResults = true }: Props) => {
    const [answers, setAnswers] = useState<VoteAnswer[] | null>(null);
    const [players, setPlayers] = useState<PlayerWithPhotos[]>([]);

    useEffect(() => {
        const _fetchResults = fetchVoteAnswers(questionId).then((response) => setAnswers(response.data));
        const _fetchQuestion = fetchQuestionPlayers(questionId).then((players) => {
            const newPlayers = players.map((player) => {
                const photo = getPlayerPhotos(player.id);
                return {
                    ...player,
                    photos: photo,
                } as PlayerWithPhotos;
            });
            setPlayers(newPlayers);
        });
        Promise.all([_fetchResults, _fetchQuestion]);
    }, [questionId]);

    if (!answers || !players) {
        return null;
    }
    const sortedPlayers = countVotesForPlayers<PlayerWithPhotos>(players, answers, hideResults);
    if (players.length === 2) {
        return <VotingAnswersFinal players={sortedPlayers} hideResults={hideResults} />;
    }

    return <VotingAnswers players={sortedPlayers} hideResults={hideResults} />;
};
