import { create } from "zustand";

import { Question, QuestionPool } from "@/api/types.api";

type AudienceStore = {
    question: Question | null;
    pool: QuestionPool | null;
    loading: boolean;
};

export const useAudienceStore = create<AudienceStore>()((set) => ({
    answers: [],
    question: null,
    pool: null,
    loading: false,
}));

export const setQuestion = (question: Question | null) => useAudienceStore.setState({ question });
export const setPool = (pool: QuestionPool | null) => useAudienceStore.setState({ pool });
export const setLoading = (loading: boolean) => useAudienceStore.setState({ loading });
