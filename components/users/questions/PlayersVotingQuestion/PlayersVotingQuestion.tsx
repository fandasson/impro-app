"use client";

import { useEffect, useMemo, useState } from "react";

import { getPlayerPhotos } from "@/api/photos.api";
import { fetchQuestionPlayers } from "@/api/questions.api";
import { submitVoteAnswer } from "@/api/submit-answer";
import { PlayerWithPhotos, Question } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { PlayerCard } from "@/components/users/questions/PlayersVotingQuestion/PlayerCard";
import { VotedOverlay } from "@/components/users/questions/PlayersVotingQuestion/VotedOverlay";
import { storeAnswer, useUsersStore } from "@/store/users.store";
import { shufflePlayers } from "@/utils/data.utils";
import { cn } from "@/utils/styling.utils";

type Props = {
    question: Question;
    navigateNext?: () => void;
    skipQuestion?: () => void;
    isOptional?: boolean;
    isChained?: boolean;
};

export const PlayersVotingQuestion = ({ question, navigateNext, skipQuestion, isOptional, isChained }: Props) => {
    const [players, setPlayers] = useState<PlayerWithPhotos[]>([]);
    const [overlayPlayer, setOverlayPlayer] = useState<PlayerWithPhotos | null>(null);
    const selectedPlayer = useUsersStore((state) => state.answers[question.id] as number | undefined);

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

    const handleSubmit = async (player: PlayerWithPhotos) => {
        storeAnswer(question.id, player.id);
        await submitVoteAnswer({
            question_id: question.id,
            player_id: player.id,
        });
        if (question.show_player_motto) {
            setOverlayPlayer(player);
        }
    };

    const rows = Math.ceil(players.length / 2) || 1;
    const shuffledPlayers = useMemo(() => shufflePlayers(players), [players]);

    return (
        <>
            <div className="px-6 pb-2 pt-7">
                <p className="text-sm leading-relaxed text-muted-foreground">
                    Odpovědi není třeba potvrzovat{" "}
                    <strong className="font-semibold text-foreground">žádným tlačítkem.</strong>
                </p>
                {question.question && <h2 className="text-md mt-4 font-medium leading-snug">{question.question}</h2>}
            </div>

            <div className={cn("grid grid-cols-2 gap-2.5 px-5 pt-5", `grid-rows-${rows}`)}>
                {shuffledPlayers &&
                    shuffledPlayers.map((player) => (
                        <PlayerCard
                            player={{ ...player, count: 0 }}
                            key={player.id}
                            hideResults={true}
                            selected={selectedPlayer === player.id}
                            onClick={() => handleSubmit(player)}
                            heightFraction={rows}
                        />
                    ))}
            </div>

            {isOptional && isChained && (
                <div className="px-5 pt-4">
                    <Button type="button" variant="outline" className="w-full" onClick={skipQuestion}>
                        Možná později
                    </Button>
                </div>
            )}

            {overlayPlayer && question.show_player_motto && (
                <VotedOverlay
                    key={overlayPlayer.id}
                    questionName={question.name}
                    player={overlayPlayer}
                    onDismiss={() => setOverlayPlayer(null)}
                />
            )}
        </>
    );
};
