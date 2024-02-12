"use client";
import { useEffect, useState } from "react";

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
    }, [questionId]);

    return (
        <div className={"flex flex-wrap gap-4"}>
            {answers.map((answer) => (
                <Badge className={"text-md px-3.5 py-2"} key={answer.id} variant="outline">
                    {answer.value}
                </Badge>
            ))}
        </div>
    );
};
