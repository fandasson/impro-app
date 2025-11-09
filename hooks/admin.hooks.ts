import { useEffect } from "react";

import { fetchMatchingAnswers, fetchOptionsAnswers, fetchTextAnswers, fetchVoteAnswers } from "@/api/answers.api";
import {
    Answer,
    AnswersResponse,
    MatchAnswer,
    OptionsAnswer,
    TableNames,
    TextAnswer,
    VoteAnswer,
} from "@/api/types.api";
import { addAnswer, modifyAnswer, setAnswers, setLoading, useAdminStore } from "@/store/admin.store";
import { createClient } from "@/utils/supabase/client";

export const useTextAnswers = (questionId: number, initialAnswers?: TextAnswer[]) =>
    useAnswers<TextAnswer>("answers_text", questionId, fetchTextAnswers, initialAnswers);

export const useVoteAnswers = (questionId: number, initialAnswers?: VoteAnswer[]) => {
    return useAnswers<VoteAnswer>("answers_vote", questionId, fetchVoteAnswers, initialAnswers);
};

export const useMatchingAnswers = (questionId: number, initialAnswers?: MatchAnswer[]) => {
    return useAnswers<MatchAnswer>("answers_match", questionId, fetchMatchingAnswers, initialAnswers);
};

export const useOptionsAnswers = (questionId: number, initialAnswers?: OptionsAnswer[]) => {
    return useAnswers<OptionsAnswer>("answers_options", questionId, fetchOptionsAnswers, initialAnswers);
};

const useAnswers = <T extends Answer>(
    table: TableNames,
    questionId: number,
    fetcher: (questionId: number) => Promise<AnswersResponse>,
    initialAnswers?: T[],
) => {
    const answers = useAdminStore((state) => state.answers);

    useEffect(() => {
        if (initialAnswers) {
            // Use server-provided data, skip fetch
            setAnswers(initialAnswers);
            setLoading(false);
            return;
        }

        // Fallback: fetch if no initial data provided
        setLoading(true);
        fetcher(questionId)
            .then((response) => {
                setAnswers(response.data ?? []);
            })
            .finally(() => setLoading(false));
    }, [fetcher, questionId, initialAnswers]);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(`admin-${table}-question-${questionId}`)
            .on<T>(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table,
                    filter: `question_id=eq.${questionId}`,
                },
                (payload) => addAnswer(payload.new),
            )
            .on<T>(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table,
                    filter: `question_id=eq.${questionId}`,
                },
                (payload) => modifyAnswer(payload.new.id, payload.new),
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, questionId]);

    return answers as T[];
};
