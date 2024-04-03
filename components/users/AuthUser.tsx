"use client";
import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";

import { storeUserId } from "@/store";

export const AuthUser = ({ children }: PropsWithChildren) => {
    const [userId, setUserId] = useState<string | null>(null);

    // auth is not exactly correct - it only generates unique identifier
    const authUser = useCallback(async () => {
        return await fetch("/auth/user");
    }, []);

    useEffect(() => {
        // not yet set, generate and store a new one
        if (!userId) {
            authUser().then((response) => {
                if (response.ok) {
                    response.text().then((userId) => {
                        setUserId(userId);
                        storeUserId(userId);
                    });
                }
            });
        }
    }, [authUser, userId]);

    return <>{children}</>;
};
