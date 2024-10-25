import { useEffect } from "react";

import { fetchActiveOrLockedQuestion, fetchQuestion } from "@/api/questions.api";
import { Performance, Question } from "@/api/types.api";
import { setLoading, setPerformance, setQuestion, useUsersStore } from "@/store/users.store";
import { createClient } from "@/utils/supabase/client";

export const useActiveOrLockedQuestion = (performanceId: number) => {
    const question = useUsersStore((state) => state.question);

    useEffect(() => {
        // only setting the loading state to true; fetchUserAnswer will set it to false
        setLoading(true);
        fetchActiveOrLockedQuestion(performanceId)
            .then((response) => {
                if (!response.data) {
                    setLoading(false);
                    return;
                }
                setQuestion(response.data);
            })
            .finally(() => setLoading(false));
    }, [performanceId]);

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
                        if (["active", "locked"].includes(newQuestion?.state)) {
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

export const usePerformance = (defaultPerformance: Performance): Performance | null => {
    const performance = useUsersStore((state) => state.performance);

    useEffect(() => {
        if (!performance) {
            setPerformance(defaultPerformance);
        }
    }, [defaultPerformance, performance]);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("activePerformance")
            .on<Performance>(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "performances",
                    filter: "id=eq." + defaultPerformance.id,
                },
                (payload) => {
                    setPerformance(payload.new);
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [defaultPerformance.id]);

    return performance;
};

export const useQuestion = (questionId: number | null) => {
    const question = useUsersStore((state) => state.question);
    if (!questionId) {
        return null;
    }
    fetchQuestion(questionId).then((response) => {
        setQuestion(response.data);
    });
    return question;
};
