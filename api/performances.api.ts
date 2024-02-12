"use server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { Enums, Tables } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type PerformanceResponse = PostgrestSingleResponse<Tables<"performances">>;

export const fetchPerformance = async (performanceId: number): Promise<PerformanceResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("performances").select("*").eq("id", performanceId).single();
};

export const setPerformanceState = async (
    performanceId: number,
    state: Enums<"performance-state">,
): Promise<PerformanceResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("performances").update({ state }).eq("id", performanceId).select().single();
};
