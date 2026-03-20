"use client";

import { DndContext, DragEndEvent, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragStartEvent, UniqueIdentifier } from "@dnd-kit/core/dist/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { fetchAvailablePlayers } from "@/api/performances.api";
import { fetchExcludedPlayerIdsForChain, fetchQuestionCharacters, fetchQuestionPlayers } from "@/api/questions.api";
import { submitMatchAnswer } from "@/api/submit-answer";
import { Character, MatchAnswer, MatchAnswerCreate, Player, Question } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { UseFormattedContent } from "@/components/ui/UserFormattedContent";
import { Draggable } from "@/components/ui/dnd/Draggable";
import { Droppable } from "@/components/ui/dnd/Droppable";
import { CharacterMatch } from "@/components/users/questions/MatchQuestion/CharacterMatch";
import { DraggableTile } from "@/components/users/questions/MatchQuestion/DraggableTile";
import { markQuestionAsAnswered, setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    question: Question;
    navigateNext?: () => void;
    skipQuestion?: () => void;
    isOptional?: boolean;
    isChained?: boolean;
    previousMatches?: MatchAnswer[];
};

export const MatchQuestion = ({
    question,
    navigateNext,
    skipQuestion,
    isOptional,
    isChained,
    previousMatches,
}: Props) => {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const [characters, setCharacters] = useState<Character[] | null>(null);
    const [draggingPlayer, setDraggingPlayer] = useState<UniqueIdentifier | null>(null);
    const [matches, setMatches] = useState<Record<number, Player>>({});
    const isLoading = useUsersStore((state) => state.loading);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        Promise.all([
            fetchQuestionPlayers(question.id),
            fetchAvailablePlayers(question.performance_id),
            fetchExcludedPlayerIdsForChain(question.id),
        ]).then(([questionPlayers, performancePlayers, excludedIds]) => {
            const playersToUse = questionPlayers.length > 0 ? questionPlayers : performancePlayers;
            setPlayers(playersToUse.filter((p) => !excludedIds.includes(p.id)));
        });
        fetchQuestionCharacters(question.id).then((fetchedCharacters) => {
            setCharacters(fetchedCharacters);
        });
    }, [question.id, question.performance_id]);

    // Initialize matches from previous answers once both players and characters are loaded
    useEffect(() => {
        if (!previousMatches || previousMatches.length === 0 || !players || !characters) return;

        const initialMatches: Record<number, Player> = {};
        for (const answer of previousMatches) {
            const player = players.find((p) => p.id === answer.player_id);
            if (player) {
                initialMatches[answer.character_id] = player;
            }
        }
        setMatches(initialMatches);
    }, [players, characters, previousMatches]);

    const findPlayer = (id: UniqueIdentifier) => {
        return players?.find((player) => player.id === id);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggingPlayer(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (over) {
            const player = findPlayer(active.id);

            setMatches((prevMatches) => {
                let matches: Record<number, Player> = {
                    ...prevMatches,
                    [over.id]: player,
                };

                // Check if this player was already assigned to a different character
                const occupied = Object.entries(prevMatches).find(([key, value]) => value.id === player?.id);
                if (occupied) {
                    const id = parseInt(occupied[0]);

                    // If the player was already matched elsewhere, remove the old match
                    if (id !== over.id) {
                        delete matches[id];
                    }
                }
                return matches;
            });
        }

        setDraggingPlayer(null);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data: MatchAnswerCreate[] = Object.entries(matches).map(([key, player]) => ({
            player_id: player.id,
            question_id: question.id,
            character_id: parseInt(key),
        }));
        await submitMatchAnswer(data);
        markQuestionAsAnswered(question.id);
        startTransition(() => {
            if (navigateNext) {
                navigateNext();
            } else {
                router.push(`/`);
            }
        });
    };

    const renderDraggingPlayer = (id: UniqueIdentifier) => {
        const player = findPlayer(id);
        if (player) {
            return <DraggableTile name={player.name} />;
        }
    };

    const canBeSubmitted = characters?.every((c) => matches[c.id] !== undefined) ?? false;
    return (
        <>
            <UseFormattedContent className={"text-lg font-medium"}>{question.question}</UseFormattedContent>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
                <div className={"grid gap-4"}>
                    {characters &&
                        characters.map((character) => (
                            <Droppable key={character.id} id={character.id}>
                                <CharacterMatch character={character} player={matches[character.id]} />
                            </Droppable>
                        ))}
                </div>
                <div className={"flex flex-wrap gap-4"}>
                    {players &&
                        players.map(({ id, name }) => {
                            const isSelected = Object.values(matches).some((player) => player.id === id);
                            return (
                                <Draggable id={id} key={id}>
                                    <DraggableTile name={name} selected={isSelected} />
                                </Draggable>
                            );
                        })}
                </div>
                <DragOverlay dropAnimation={null}>
                    {draggingPlayer ? renderDraggingPlayer(draggingPlayer) : null}
                </DragOverlay>
            </DndContext>
            <Button type={"submit"} disabled={!canBeSubmitted || isLoading || isPending} onClick={handleSubmit}>
                {isLoading || isPending ? "Odesílám..." : `Pokračovat`}
            </Button>
            {isOptional && isChained && (
                <Button type={"button"} variant={"outline"} onClick={skipQuestion} disabled={isLoading || isPending}>
                    Možná později
                </Button>
            )}
        </>
    );
};
