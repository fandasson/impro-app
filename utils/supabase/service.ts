import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/utils/supabase/entity.types";

export const createServiceClient = () =>
    createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
