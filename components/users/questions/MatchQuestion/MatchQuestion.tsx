"use client";

import { DndContext, DragEndEvent, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragStartEvent, UniqueIdentifier } from "@dnd-kit/core/dist/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { fetchMatchQuestionPlayers } from "@/api/questions.api";
import { submitMatchAnswer } from "@/api/submit-answer";
import { MatchAnswer, Player } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { Draggable } from "@/components/ui/dnd/Draggable";
import { Droppable } from "@/components/ui/dnd/Droppable";
import { Character } from "@/components/users/questions/MatchQuestion/Character";
import { PlayerMatch } from "@/components/users/questions/MatchQuestion/PlayerMatch";
import { markQuestionAsAnswered, setLoading, useStore } from "@/store";
import { sluggifyString } from "@/utils/string.utils";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: Tables<"questions">;
};

export const MatchQuestion = ({ question }: Props) => {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const [draggingCharacter, setDraggingCharacter] = useState<UniqueIdentifier | null>(null);
    const [matches, setMatches] = useState<Record<number, string>>({});
    const [isPending, startTransition] = useTransition();
    const isLoading = useStore((state) => state.loading);
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
        fetchMatchQuestionPlayers(question.id).then((response) => setPlayers(response));
    }, [question.id]);

    const findName = (id: UniqueIdentifier) => {
        return question.names?.find((name) => sluggifyString(`character-${name}`) === id);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggingCharacter(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (over) {
            // Find the name associated with the active draggable item
            const name = findName(active.id);

            setMatches((prevMatches) => {
                // Create a new matches object, adding the new match
                let matches: Record<number, string> = {
                    ...prevMatches,
                    [over.id]: name,
                };

                // Check if the player was already matched with a different character
                const occupied = Object.entries(prevMatches).find(([key, value]) => value === name);
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
        const data: MatchAnswer[] = Object.entries(matches).map(([key, value]) => ({
            player_id: parseInt(key),
            question_id: question.id,
            value: value,
        }));
        await submitMatchAnswer(data);
        setLoading(false);
        markQuestionAsAnswered(question.id);
        startTransition(() => {
            router.refresh();
        });
    };

    const renderDraggingCharacter = (id: UniqueIdentifier) => {
        const name = findName(id);
        if (name) {
            return <Character name={name} />;
        }
    };
    const canBeSubmitted = players?.every((player) => matches[player.id] !== undefined) ?? false;
    return (
        <>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
                <div className={"flex gap-4"}>
                    {question.names &&
                        question.names.map((name) => {
                            const id = sluggifyString(`character-${name}`);
                            return (
                                <Draggable id={id} key={id}>
                                    <Character name={name} />
                                </Draggable>
                            );
                        })}
                </div>
                <div className={"grid gap-4"}>
                    {players &&
                        players.map((player) => (
                            <Droppable key={player.id} id={player.id}>
                                <PlayerMatch player={player} name={matches[player.id]} />
                            </Droppable>
                        ))}
                </div>
                <DragOverlay dropAnimation={null}>
                    {draggingCharacter ? renderDraggingCharacter(draggingCharacter) : null}
                </DragOverlay>
            </DndContext>
            <Button type={"submit"} disabled={!canBeSubmitted || isPending || isLoading} onClick={handleSubmit}>
                {isPending ? "Odesílám..." : "Odeslat"}
            </Button>
        </>
    );
};
