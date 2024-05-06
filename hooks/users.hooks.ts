import { useEffect, useState } from "react";

import { fetchActiveOrLockedQuestion } from "@/api/questions.api";
import { Performance } from "@/api/types.api";
import { setLoading, setQuestion, useUsersStore } from "@/store/users.store";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

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
                .on<Tables<"questions">>(
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

export const usePerformance = (defaultPerformance: Performance): Performance => {
    const [performance, setPerformance] = useState(defaultPerformance);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("activePerformance")
            .on<Tables<"performances">>(
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
