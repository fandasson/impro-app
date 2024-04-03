import { create } from "zustand";

type Store = {
    userId?: string;
    answeredQuestions: Record<number, boolean>;
};

export const useStore = create<Store>()((set) => ({
    answeredQuestions: {},
}));

export const storeUserId = (userId: string) => useStore.setState({ userId });
export const markQuestionAsAnswered = (questionId: number) =>
    useStore.setState((state) => ({
        answeredQuestions: { ...state.answeredQuestions, [questionId]: true },
    }));
