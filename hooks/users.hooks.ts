import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { fetchActiveOrLockedQuestion, fetchFirstQuestionInChain, fetchQuestion } from "@/api/questions.api";
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

export const useChainNavigation = (question: Question | null) => {
    const [chainFirstId, setChainFirstId] = useState<number | null>(null);
    const [isChained, setIsChained] = useState(false);
    const router = useRouter();

    const questionId = question?.id ?? null;
    const followingQuestionId = question?.following_question_id ?? null;

    useEffect(() => {
        if (questionId === null) return;

        fetchFirstQuestionInChain(questionId).then((firstId) => {
            if (firstId !== null) {
                setIsChained(true);
                setChainFirstId(firstId);
            } else {
                setIsChained(followingQuestionId !== null);
                setChainFirstId(null);
            }
        });
    }, [questionId, followingQuestionId]);

    const navigateNext = useCallback(() => {
        if (!question) return;
        if (question.following_question_id) {
            router.push(`/question/${question.following_question_id}`);
        } else if (chainFirstId !== null) {
            // Loop back to chain start
            router.push(`/question/${chainFirstId}`);
        } else {
            router.push(`/`);
        }
    }, [question, chainFirstId, router]);

    const skipQuestion = useCallback(() => {
        navigateNext();
    }, [navigateNext]);

    return { navigateNext, skipQuestion, isChained, chainFirstId };
};
