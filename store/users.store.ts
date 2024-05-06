import { create } from "zustand";

import { Question } from "@/api/types.api";

type Store = {
    userId?: string;
    answeredQuestions: Record<number, boolean>;
    loading: boolean;
    question: Question | null;
};

export const useUsersStore = create<Store>()((set) => ({
    answeredQuestions: {},
    loading: false,
    question: null,
}));

export const storeUserId = (userId: string) => useUsersStore.setState({ userId });
export const markQuestionAsAnswered = (questionId: number) =>
    useUsersStore.setState((state) => ({
        answeredQuestions: { ...state.answeredQuestions, [questionId]: true },
    }));

export const setLoading = (loading: boolean) => useUsersStore.setState({ loading });
export const setQuestion = (question: Question | null) => useUsersStore.setState({ question });
