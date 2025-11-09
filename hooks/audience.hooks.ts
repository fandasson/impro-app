import { useEffect } from "react";

import { fetchVisiblePool } from "@/api/question-pools.api";
import { findQuestion } from "@/api/questions.api";
import { Question, QuestionPool } from "@/api/types.api";
import { setPool, setQuestion, useAudienceStore } from "@/store/audience.store";
import { createClient } from "@/utils/supabase/client";

export const useQuestion = (performanceId: number, initialQuestion?: Question | null) => {
    const question = useAudienceStore((state) => state.question);

    useEffect(() => {
        if (initialQuestion !== undefined) {
            // Use server-provided data, skip fetch
            setQuestion(initialQuestion);
            return;
        }

        // Fallback: fetch if no initial data provided
        findQuestion(performanceId, "audience_visibility.eq.question,audience_visibility.eq.results").then(
            (response) => {
                if (!response.data) {
                    return;
                }
                setQuestion(response.data);
            },
        );
    }, [performanceId, initialQuestion]);

    useEffect(() => {
        if (performanceId) {
            const supabase = createClient();
            const channel = supabase
                .channel("activeOrLockedQuestionChannel")
                .on<Question>(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "questions",
                        filter: `performance_id=eq.${performanceId}`,
                    },
                    (payload) => {
                        const newQuestion = payload.new;
                        if (["question", "results"].includes(newQuestion?.audience_visibility)) {
                            setQuestion(newQuestion);
                        } else {
                            setQuestion(null);
                        }
                    },
                )
                .subscribe();
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [performanceId]);

    return question;
};

export const usePool = (performanceId: number, initialPool?: QuestionPool | null) => {
    const pool = useAudienceStore((state) => state.pool);

    useEffect(() => {
        if (initialPool !== undefined) {
            // Use server-provided data, skip fetch
            setPool(initialPool);
            return;
        }

        // Fallback: fetch if no initial data provided
        fetchVisiblePool(performanceId).then((response) => {
            if (!response) {
                return;
            }
            setPool(response);
        });
    }, [performanceId, initialPool]);

    useEffect(() => {
        if (performanceId) {
            const supabase = createClient();
            const channel = supabase
                .channel("visibleQuestionPoolChannel")
                .on<QuestionPool>(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "questions_pool",
                        filter: `performance_id=eq.${performanceId}`,
                    },
                    (payload) => {
                        const newPool = payload.new;
                        if (newPool.audience_visibility) {
                            setPool(newPool);
                        } else {
                            setPool(null);
                        }
                    },
                )
                .subscribe();
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [performanceId]);

    return pool;
};
