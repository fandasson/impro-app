"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { Player, Question } from "@/api/types.api";
import { Enums, Tables } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type QuestionResponse = PostgrestSingleResponse<Tables<"questions">>;
type QuestionDetailResponse = PostgrestSingleResponse<Question>;

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

export const fetchQuestion = async (questionId: number): Promise<QuestionDetailResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("questions").select("*, players (name)").eq("id", questionId).single();
};

export const fetchMatchQuestionPlayers = async (questionId: number): Promise<Player[]> => {
    const supabase = createClient(cookies());
    const response = await supabase.from("questions").select("players(*)").eq("id", questionId).single();
    return response.data?.players || [];
};

export const setQuestionState = async (
    questionId: number,
    state: Enums<"question-state">,
): Promise<QuestionResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("questions").update({ state }).eq("id", questionId).select().single();
};
