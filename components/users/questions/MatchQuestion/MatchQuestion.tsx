"use client";

import { DndContext, DragEndEvent, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragStartEvent, UniqueIdentifier } from "@dnd-kit/core/dist/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Character as CharacterTile } from "./Character";

import { fetchQuestionCharacters, fetchQuestionPlayers } from "@/api/questions.api";
import { submitMatchAnswer } from "@/api/submit-answer";
import { Character, MatchAnswerCreate, Player, Question } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { Draggable } from "@/components/ui/dnd/Draggable";
import { Droppable } from "@/components/ui/dnd/Droppable";
import { PlayerMatch } from "@/components/users/questions/MatchQuestion/PlayerMatch";
import { markQuestionAsAnswered, setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    question: Question;
};

export const MatchQuestion = ({ question }: Props) => {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const [characters, setCharacters] = useState<Character[] | null>(null);
    const [draggingCharacter, setDraggingCharacter] = useState<UniqueIdentifier | null>(null);
    const [matches, setMatches] = useState<Record<number, Character>>({});
    const [isPending, startTransition] = useTransition();
    const isLoading = useUsersStore((state) => state.loading);
    const router = useRouter();
    const performance = useUsersStore((state) => state.performance);

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
        fetchQuestionPlayers(question.id).then((response) => setPlayers(response));
        fetchQuestionCharacters(question.id).then((response) => setCharacters(response));
    }, [question.id]);

    const findCharacter = (id: UniqueIdentifier) => {
        return characters?.find((character) => character.id === id);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggingCharacter(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (over) {
            // Find the name associated with the active draggable item
            const character = findCharacter(active.id);

            setMatches((prevMatches) => {
                // Create a new matches object, adding the new match
                let matches: Record<number, Character> = {
                    ...prevMatches,
                    [over.id]: character,
                };

                // Check if the player was already matched with a different character
                const occupied = Object.entries(prevMatches).find(([key, value]) => value.id === character?.id);
                if (occupied) {
                    const id = parseInt(occupied[0]);

                    // If the player was already matched, remove the old match
                    // This prevents removing the newly added match
                    if (id !== over.id) {
                        delete matches[id];
                    }
                }
                return matches;
            });
        }

        // Reset the draggingCharacter state to null after the drag operation is complete
        setDraggingCharacter(null);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data: MatchAnswerCreate[] = Object.entries(matches).map(([key, character]) => ({
            player_id: parseInt(key),
            question_id: question.id,
            character_id: character.id,
        }));
        await submitMatchAnswer(data);
        markQuestionAsAnswered(question.id);
        startTransition(() => {
            if (question.following_question_id) {
                router.push(`/question/${question.following_question_id}`);
            } else {
                router.push(`/${performance?.url_slug}`);
            }
            setLoading(false);
        });
    };

    const renderDraggingCharacter = (id: UniqueIdentifier) => {
        const character = findCharacter(id);
        if (character) {
            return <CharacterTile name={character.name} />;
        }
    };

    const canBeSubmitted = players?.every((player) => matches[player.id] !== undefined) ?? false;
    return (
        <>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
                <div className={"grid gap-4"}>
                    {players &&
                        players.map((player) => (
                            <Droppable key={player.id} id={player.id}>
                                <PlayerMatch player={player} character={matches[player.id]} />
                            </Droppable>
                        ))}
                </div>
                <div className={"flex flex-wrap gap-4"}>
                    {characters &&
                        characters.map(({ id, name }) => {
                            const isSelected = Object.values(matches).some((character) => character.id === id);
                            return (
                                <Draggable id={id} key={id}>
                                    <CharacterTile name={name} selected={isSelected} />
                                </Draggable>
                            );
                        })}
                </div>
                <DragOverlay dropAnimation={null}>
                    {draggingCharacter ? renderDraggingCharacter(draggingCharacter) : null}
                </DragOverlay>
            </DndContext>
            <Button type={"submit"} disabled={!canBeSubmitted || isPending || isLoading} onClick={handleSubmit}>
                {isPending ? "Odesílám..." : `Odeslat ${!question.multiple ? "(není cesty zpět)" : ""}`}
            </Button>
        </>
    );
};
