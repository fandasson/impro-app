/**
 * Creates a reusable subscription status handler for Supabase realtime channels
 *
 * @param description - Human-readable description (e.g., "[User] Questions", "[Admin] Answers")
 * @param channelName - The unique channel name for debugging
 * @returns Status callback function for .subscribe()
 *
 * @example
 * ```typescript
 * const channelName = `user-performance-${id}`;
 * const channel = supabase
 *   .channel(channelName)
 *   .on(...)
 *   .subscribe(createSubscriptionStatusHandler('[User] Performance', channelName));
 * ```
 */
export function createSubscriptionStatusHandler(description: string, channelName: string) {
    return (status: string) => {
        if (status === "SUBSCRIBED") {
            console.debug(`${description} subscribed:`, channelName);
        }

        if (status === "CHANNEL_ERROR") {
            console.error(`${description} subscription error:`, channelName);
        }

        if (status === "TIMED_OUT") {
            console.error(`${description} subscription timeout:`, channelName);
        }

        if (status === "CLOSED") {
            console.debug(`${description} channel closed:`, channelName);
        }
    };
}
