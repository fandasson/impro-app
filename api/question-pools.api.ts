import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export const fetchAvailablePools = async (performanceId: number) => {
    const supabase = createClient(cookies());
    const response = await supabase.from("questions_pool").select("*").eq("performance_id", performanceId);
    return response.data ?? [];
};
export const fetchQuestionPool = async (poolId: number) => {
    const supabase = createClient(cookies());
    const response = await supabase.from("questions_pool").select("*").eq("id", poolId).single();
    return response.data;
};
