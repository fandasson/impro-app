import { createBrowserClient } from "@supabase/ssr";

/**
 * @deprecated
 */
export const createClient = () =>
    createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
