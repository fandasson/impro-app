"use client";
import { useEffect, useState } from "react";

import { RemoveAnswersButton } from "@/components/admin/answers/RemoveAnswersButton";
import { Badge } from "@/components/ui/Badge";
import { CHANNEL_DATABASE } from "@/utils/constants.utils";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    questionId: number;
    answers: Tables<"answers">[];
};
export const TextAnswers = ({ questionId, answers: initialAnswers }: Props) => {
    const [answers, setAnswers] = useState(initialAnswers);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        if (selectedAnswers.includes(id)) {
            setSelectedAnswers(selectedAnswers.filter((a) => a !== id));
        } else {
            setSelectedAnswers([...selectedAnswers, id]);
        }
    };

    const handleRemove = () => {
        setAnswers((prevState) => prevState.filter((a) => !selectedAnswers.includes(a.id)));
        setSelectedAnswers([]);
    };

    // @ts-ignore
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(CHANNEL_DATABASE)
            .on<Tables<"answers">>(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "answers",
                    filter: "question_id=eq." + questionId,
                },
                (payload) => setAnswers([...answers, payload.new]),
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [setAnswers, answers, questionId]);

    return (
        <div className={"flex flex-col"}>
            <div className={"mb-8 grid grid-cols-1 gap-4"}>
                {answers.map((answer) => {
                    const selected = selectedAnswers.includes(answer.id);
                    return (
                        <Badge
                            className={"text-md cursor-pointer px-3.5 py-2"}
                            key={answer.id}
                            variant={`${selected ? "default" : "outline"}`}
                            onClick={() => toggleSelect(answer.id)}
                        >
                            {answer.value}
                        </Badge>
                    );
                })}
            </div>
            <RemoveAnswersButton answersIds={selectedAnswers} callback={handleRemove} />
        </div>
    );
};
