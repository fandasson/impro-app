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

export const useTextAnswers = (questionId: number) =>
    useAnswers<TextAnswer>("answers_text", questionId, fetchTextAnswers);

export const useVoteAnswers = (questionId: number) => {
    return useAnswers<VoteAnswer>("answers_vote", questionId, fetchVoteAnswers);
};

export const useMatchingAnswers = (questionId: number) => {
    return useAnswers<MatchAnswer>("answers_match", questionId, fetchMatchingAnswers);
};

export const useOptionsAnswers = (questionId: number) => {
    return useAnswers<OptionsAnswer>("answers_options", questionId, fetchOptionsAnswers);
};

const useAnswers = <T extends Answer>(
    table: TableNames,
    questionId: number,
    fetcher: (questionId: number) => Promise<AnswersResponse>,
) => {
    const answers = useAdminStore((state) => state.answers);

    useEffect(() => {
        setLoading(true);
        fetcher(questionId)
            .then((response) => {
                setAnswers(response.data ?? []);
            })
            .finally(() => setLoading(false));
    }, [fetcher, questionId]);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(`admin-${table}-answers`)
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
