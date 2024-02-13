"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { Enums, Tables } from "@/utils/supabase/entity.types";
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

export const fetchQuestion = async (questionId: number): Promise<QuestionResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("questions").select("*").eq("id", questionId).single();
};

export const setQuestionState = async (
    questionId: number,
    state: Enums<"question-state">,
): Promise<QuestionResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("questions").update({ state }).eq("id", questionId).select().single();
};
