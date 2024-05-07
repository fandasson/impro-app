import { create } from "zustand";

import { Answer } from "@/api/types.api";

type AdminStore = {
    loading: boolean;
    answers: Answer[];
};

export const useAdminStore = create<AdminStore>()((set) => ({
    answers: [],
    loading: false,
}));

export const setLoading = (loading: boolean) => useAdminStore.setState({ loading });
export const setAnswers = (answers: Answer[]) => useAdminStore.setState({ answers });
export const addAnswer = (answer: Answer) => {
    useAdminStore.setState((state) => ({ answers: [...state.answers, answer] }));
};

export const modifyAnswer = (answerId: number, answer: Answer) => {
    useAdminStore.setState((state) => {
        const newAnswers = state.answers.map((a) => (a.id === answerId ? answer : a));
        return { answers: newAnswers };
    });
};

export const removeAnswer = (answerId: number) => {
    useAdminStore.setState((state) => {
        const newAnswers = state.answers.filter((a) => a.id !== answerId);
        return { answers: newAnswers };
    });
};

export const removeAnswers = (answerIds: number[]) => {
    useAdminStore.setState((state) => {
        const newAnswers = state.answers.filter((a) => !answerIds.includes(a.id));
        return { answers: newAnswers };
    });
};
