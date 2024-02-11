import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type UserContextType = {
    userId: string | null;
};

const LOCAL_STORAGE_USER_ID_KEY = "userId";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: PropsWithChildren) => {
    const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY));

    useEffect(() => {
        // not yet set, generate and store a new one
        if (!userId) {
            const newUserId = uuidv4();
            setUserId(newUserId);
            localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, newUserId);
        }
    }, [userId]);

    return <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>;
};

export const useUserId = (): string => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserId must be used within a UserIdProvider");
    }
    if (!context.userId) {
        throw new Error("userId is not set");
    }
    return context.userId;
};
