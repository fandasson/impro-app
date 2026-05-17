import { useSyncExternalStore } from "react";

let reconnectCount = 0;
const listeners = new Set<() => void>();
let initialized = false;

const bump = () => {
    if (document.visibilityState === "visible") {
        reconnectCount += 1;
        listeners.forEach((listener) => listener());
    }
};

const ensureInitialized = () => {
    if (initialized || typeof document === "undefined") return;
    initialized = true;
    document.addEventListener("visibilitychange", bump);
    window.addEventListener("online", bump);
};

const subscribe = (listener: () => void) => {
    ensureInitialized();
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => reconnectCount;
const getServerSnapshot = () => 0;

/**
 * Shared counter, incremented each time the page returns to the foreground or
 * the network comes back online. Module-level so a component mounting *after* a
 * return event still observes the non-zero value and refetches instead of
 * trusting stale server-rendered initial data.
 */
export const useReconnectKey = (): number =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

/**
 * Detaches the global visibilitychange/online listeners. Called when the
 * performance reaches `finished` state — there is nothing left to keep in sync,
 * so no reason to keep reacting to foreground returns. `initialized` is reset so
 * the listeners re-attach if another performance starts without a full reload.
 */
export const teardownReconnectListeners = () => {
    if (!initialized || typeof document === "undefined") return;
    document.removeEventListener("visibilitychange", bump);
    window.removeEventListener("online", bump);
    initialized = false;
};
