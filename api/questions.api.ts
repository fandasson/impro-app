"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { Tables } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type QuestionResponse = PostgrestSingleResponse<Tables<"questions">>;
export const fetchActiveQuestion = async (performanceId: number): Promise<QuestionResponse> => {
    const supabase = createClient(cookies());
    return supabase
        .from("questions")
        .select("*")
        .eq("performance_id", performanceId)
        .eq("state", "active")
        .limit(1)
        .single();
};
