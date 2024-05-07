import { useEffect } from "react";

import { fetchAnswers } from "@/api/answers.api";
import { Answer } from "@/api/types.api";
import { addAnswer, modifyAnswer, setAnswers, setLoading, useAdminStore } from "@/store/admin.store";
import { createClient } from "@/utils/supabase/client";

export const useAnswers = (questionId: number) => {
    const answers = useAdminStore((state) => state.answers);
    useEffect(() => {
        setLoading(true);
        fetchAnswers(questionId)
            .then((response) => setAnswers(response.data ?? []))
            .finally(() => setLoading(false));
    }, [questionId]);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("admin-answers")
            .on<Answer>(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "answers",
                    filter: `question_id=eq.${questionId}`,
                },
                (payload) => addAnswer(payload.new),
            )
            .on<Answer>(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "answers",
                    filter: `question_id=eq.${questionId}`,
                },
                (payload) => modifyAnswer(payload.new.id, payload.new),
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [questionId]);

    return answers;
};
