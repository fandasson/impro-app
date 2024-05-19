import { useEffect } from "react";

import { findQuestion } from "@/api/questions.api";
import { setQuestion, useAudienceStore } from "@/store/audience.store";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

export const useQuestion = (performanceId: number) => {
    const question = useAudienceStore((state) => state.question);

    useEffect(() => {
        findQuestion(performanceId, "audience_visibility.eq.question,audience_visibility.eq.results").then(
            (response) => {
                if (!response.data) {
                    return;
                }
                setQuestion(response.data);
            },
        );
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
