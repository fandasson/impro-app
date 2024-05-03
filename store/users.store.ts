import { create } from "zustand";

type Store = {
    userId?: string;
    answeredQuestions: Record<number, boolean>;
    loading: boolean;
};

export const useUsersStore = create<Store>()((set) => ({
    answeredQuestions: {},
    loading: false,
}));

export const storeUserId = (userId: string) => useUsersStore.setState({ userId });
export const markQuestionAsAnswered = (questionId: number) =>
    useUsersStore.setState((state) => ({
        answeredQuestions: { ...state.answeredQuestions, [questionId]: true },
    }));

export const setLoading = (loading: boolean) => useUsersStore.setState({ loading });
