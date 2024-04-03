import { create } from "zustand";

type Store = {
    userId?: string;
};

export const useStore = create<Store>()((set) => ({}));

export const storeUserId = (userId: string) => useStore.setState({ userId });
