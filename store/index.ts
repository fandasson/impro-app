import { create } from "zustand";

type Store = {
    userId?: string;
    answeredQuestions: Record<number, boolean>;
    loading: boolean;
};

export const useStore = create<Store>()((set) => ({
    answeredQuestions: {},
    loading: false,
}));

export const storeUserId = (userId: string) => useStore.setState({ userId });
export const markQuestionAsAnswered = (questionId: number) =>
    useStore.setState((state) => ({
        answeredQuestions: { ...state.answeredQuestions, [questionId]: true },
    }));

export const setLoading = (loading: boolean) => useStore.setState({ loading });
