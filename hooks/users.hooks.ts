import { useEffect } from "react";

import { fetchActiveOrLockedQuestion, fetchQuestion } from "@/api/questions.api";
import { Performance, Question } from "@/api/types.api";
import { setLoading, setPerformance, setQuestion, useUsersStore } from "@/store/users.store";
import { createClient } from "@/utils/supabase/client";
import { createSubscriptionStatusHandler } from "@/utils/supabase/subscription";

export const useActiveOrLockedQuestion = (performanceId: number, initialQuestion?: Question | null) => {
    const question = useUsersStore((state) => state.question);

    useEffect(() => {
        if (initialQuestion !== undefined) {
            // Use server-provided data, skip fetch
            setQuestion(initialQuestion);
            setLoading(false);
            return;
        }

        // Fallback: fetch if no initial data provided
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
    }, [performanceId, initialQuestion]);

    useEffect(() => {
        if (performanceId) {
            const supabase = createClient();
            const channelName = `user-performance-${performanceId}-active-question`;
            const channel = supabase
                .channel(channelName)
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
                .subscribe(createSubscriptionStatusHandler("[User] Questions", channelName));
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
        const channelName = `user-performance-${defaultPerformance.id}`;
        const channel = supabase
            .channel(channelName)
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
            .subscribe(createSubscriptionStatusHandler("[User] Performance", channelName));

        return () => {
            supabase.removeChannel(channel);
        };
    }, [defaultPerformance.id]);

    return performance;
};

export const useQuestion = (questionId: number | null, initialQuestion?: Question | null) => {
    const question = useUsersStore((state) => state.question);

    useEffect(() => {
        if (!questionId) {
            return;
        }

        if (initialQuestion !== undefined) {
            // Use server-provided data, skip fetch
            setQuestion(initialQuestion);
            return;
        }

        // Fallback: fetch if no initial data and question doesn't match
        if (!question || question.id !== questionId) {
            fetchQuestion(questionId).then((response) => {
                setQuestion(response.data);
            });
        }
    }, [questionId, initialQuestion, question]);

    return question;
};
