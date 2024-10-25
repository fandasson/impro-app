import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Performance, Question } from "@/api/types.api";

type Store = {
    userId?: string;
    answeredQuestions: Record<number, boolean>;
    loading: boolean;
    question: Question | null;
    answers: Record<number, string | number>;
    performance: Performance | null;
};

export const useUsersStore = create<Store>()(
    persist(
        (set) => ({
            answeredQuestions: {},
            loading: false,
            question: null,
            performance: null,
            answers: {},
        }),
        {
            name: "user-storage",
            // storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
);

export const storeUserId = (userId: string) => useUsersStore.setState({ userId });
export const markQuestionAsAnswered = (questionId: number) =>
    useUsersStore.setState((state) => ({
        answeredQuestions: { ...state.answeredQuestions, [questionId]: true },
    }));

export const setLoading = (loading: boolean) => useUsersStore.setState({ loading });
export const setQuestion = (question: Question | null) => useUsersStore.setState({ question });
export const setPerformance = (performance: Performance | null) => useUsersStore.setState({ performance });
export const storeAnswer = (questionId: number, answer: string | number) =>
    useUsersStore.setState((state) => ({ answers: { ...state.answers, [questionId]: answer } }));
