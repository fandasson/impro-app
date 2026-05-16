import { useEffect } from "react";

import { fetchVisiblePool } from "@/api/question-pools.api";
import { findQuestion } from "@/api/questions.api";
import type { Question, QuestionPool } from "@/api/types.api";
import { useReconnectKey } from "@/hooks/realtime.hooks";
import { setPool, setQuestion, useAudienceStore } from "@/store/audience.store";
import { createClient } from "@/utils/supabase/client";
import { createSubscriptionStatusHandler } from "@/utils/supabase/subscription";

export const useQuestion = (performanceId: number, initialQuestion?: Question | null) => {
    const question = useAudienceStore((state) => state.question);
    const reconnectKey = useReconnectKey();

    useEffect(() => {
        if (reconnectKey === 0 && initialQuestion !== undefined) {
            setQuestion(initialQuestion);
        }
        // Always reconcile with the DB: the component can remount after pool
        // visibility toggles, and the reconnectKey bump fires after iOS Safari
        // suspends the tab — question UPDATE events missed meanwhile would
        // otherwise leave a stale question in the store.
        findQuestion(performanceId, "audience_visibility.eq.question,audience_visibility.eq.results").then(
            (response) => {
                setQuestion(response.data ?? null);
            },
        );
    }, [performanceId, initialQuestion, reconnectKey]);

    useEffect(() => {
        if (performanceId) {
            const supabase = createClient();
            const channelName = `audience-performance-${performanceId}-question`;
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
                        if (["question", "results"].includes(newQuestion?.audience_visibility)) {
                            setQuestion(newQuestion);
                        } else {
                            setQuestion(null);
                        }
                    },
                )
                .subscribe(createSubscriptionStatusHandler("[Audience] Questions", channelName));
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [performanceId, reconnectKey]);

    return question;
};

export const usePool = (performanceId: number, initialPool?: QuestionPool | null) => {
    const pool = useAudienceStore((state) => state.pool);
    const reconnectKey = useReconnectKey();

    useEffect(() => {
        // On reconnect (reconnectKey > 0) always refetch: server-provided data is stale.
        if (reconnectKey === 0 && initialPool !== undefined) {
            setPool(initialPool);
            return;
        }

        fetchVisiblePool(performanceId).then((response) => {
            setPool(response ?? null);
        });
    }, [performanceId, initialPool, reconnectKey]);

    useEffect(() => {
        if (performanceId) {
            const supabase = createClient();
            const channelName = `audience-performance-${performanceId}-pool`;
            const channel = supabase
                .channel(channelName)
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
                .subscribe(createSubscriptionStatusHandler("[Audience] Pool", channelName));
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [performanceId, reconnectKey]);

    return pool;
};
