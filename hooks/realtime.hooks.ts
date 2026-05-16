import { useEffect, useState } from "react";

/**
 * Increments each time the page returns to the foreground or the network
 * comes back online. Used to force Supabase realtime channels to re-subscribe
 * and to trigger a state refetch after iOS Safari suspends a backgrounded tab.
 */
export const useReconnectKey = (): number => {
    const [key, setKey] = useState(0);

    useEffect(() => {
        const bump = () => {
            if (document.visibilityState === "visible") {
                setKey((k) => k + 1);
            }
        };
        document.addEventListener("visibilitychange", bump);
        window.addEventListener("online", bump);
        return () => {
            document.removeEventListener("visibilitychange", bump);
            window.removeEventListener("online", bump);
        };
    }, []);

    return key;
};
