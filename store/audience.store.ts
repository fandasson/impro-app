import { create } from "zustand";

import { Question, QuestionPool } from "@/api/types.api";

type AudienceStore = {
    question: Question | null;
    pool: QuestionPool | null;
};

export const useAudienceStore = create<AudienceStore>()((set) => ({
    answers: [],
    question: null,
    pool: null,
}));

export const setQuestion = (question: Question | null) => useAudienceStore.setState({ question });
export const setPool = (pool: QuestionPool | null) => useAudienceStore.setState({ pool });
