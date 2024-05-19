import { create } from "zustand";

import { Answer, Question } from "@/api/types.api";

type AudienceStore = {
    answers: Answer[];
    question: Question | null;
};

export const useAudienceStore = create<AudienceStore>()((set) => ({
    answers: [],
    question: null,
}));

export const setAnswers = (answers: Answer[]) => useAudienceStore.setState({ answers });
export const setQuestion = (question: Question | null) => useAudienceStore.setState({ question });
