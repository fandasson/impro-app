import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/utils/supabase/entity.types";

let client: SupabaseClient<Database> | undefined;

/**
 * Get or create singleton Supabase browser client.
 * Ensures only one WebSocket connection is maintained across the app.
 */
export const createClient = (): SupabaseClient<Database> => {
    if (client) {
        return client;
    }

    client = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    return client;
};

/**
 * Reset the singleton client (useful for testing or forced reconnection).
 */
export const resetClient = () => {
    client = undefined;
};
