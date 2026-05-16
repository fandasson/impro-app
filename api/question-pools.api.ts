"use server";
import { revalidatePath } from "next/cache";

import type { ServerActionResult } from "@/api/types.api";
import type { QuestionPool } from "@/api/types.api";
import { createClient } from "@/utils/supabase/server";

export const fetchAvailablePools = async (performanceId: number) => {
    const supabase = await createClient();
    const response = await supabase.from("questions_pool").select("*").eq("performance_id", performanceId);
    return response.data ?? [];
};

export const fetchQuestionPool = async (poolId: number) => {
    const supabase = await createClient();
    const response = await supabase.from("questions_pool").select("*").eq("id", poolId).single();
    return response.data;
};

export const fetchVisiblePool = async (performanceId: number) => {
    const supabase = await createClient();
    const response = await supabase
        .from("questions_pool")
        .select("*")
        .eq("performance_id", performanceId)
        .eq("audience_visibility", true)
        .single();
    return response.data;
};

export const setPoolAudienceVisibility = async (
    poolId: number,
    visibility: boolean,
    performanceId: number,
): Promise<void> => {
    const supabase = await createClient();
    // first, hide visible
    await supabase.from("questions_pool").update({ audience_visibility: false }).eq("audience_visibility", true);
    // also, hide all audience visible questions
    await supabase.from("questions").update({ audience_visibility: "hidden" }).eq("performance_id", performanceId);

    // set required visibility
    await supabase.from("questions_pool").update({ audience_visibility: visibility }).eq("id", poolId);
    revalidatePath(`/admin/performances/${performanceId}/question-pools`);
    revalidatePath(`/admin/performances/${performanceId}/question-pools/${poolId}`);
};

export const createPool = async (performanceId: number, name: string): Promise<ServerActionResult<QuestionPool>> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
        .from("questions_pool")
        .insert({ performance_id: performanceId, name: name.trim() || null })
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/performances/${performanceId}/question-pools`);
    return { success: true, data };
};

export const deletePool = async (poolId: number, performanceId: number): Promise<ServerActionResult<void>> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { count, error: countError } = await supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("pool_id", poolId);

    if (countError) return { success: false, error: countError.message };
    if (count && count > 0) return { success: false, error: "Skupinu nelze smazat, protože obsahuje otázky." };

    const { error } = await supabase.from("questions_pool").delete().eq("id", poolId);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/performances/${performanceId}/question-pools`);
    return { success: true, data: undefined };
};
