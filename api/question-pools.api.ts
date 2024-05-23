"use server";
import { revalidatePath } from "next/cache";
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

export const setPoolAudienceVisibility = async (
    poolId: number,
    visibility: boolean,
    performanceId: number,
): Promise<void> => {
    const supabase = createClient(cookies());
    // first, hide visible
    await supabase.from("questions_pool").update({ audience_visibility: false }).eq("audience_visibility", true);

    // set required visibility
    await supabase.from("questions_pool").update({ audience_visibility: visibility }).eq("id", poolId);
    revalidatePath(`/admin/performances/${performanceId}/question-pools`);
    revalidatePath(`/admin/performances/${performanceId}/question-pools/${poolId}`);
};
