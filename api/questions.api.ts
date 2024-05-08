"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { Player, QuestionDetail } from "@/api/types.api";
import { COOKIE_USER_ID } from "@/utils/constants.utils";
import { Enums, Tables } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type QuestionResponse = PostgrestSingleResponse<Tables<"questions">>;
type QuestionDetailResponse = PostgrestSingleResponse<QuestionDetail>;

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

export const fetchActiveOrLockedQuestion = async (performanceId: number): Promise<QuestionResponse> => {
    const supabase = createClient(cookies());
    return supabase
        .from("questions")
        .select("*")
        .eq("performance_id", performanceId)
        .or("state.eq.active,state.eq.locked")
        .limit(1)
        .single();
};

export const checkUserAlreadyAnswered = async (questionId: number): Promise<boolean> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const userId = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!userId) {
        throw new Error("User not found");
    }

    const responseAnswers = await supabase
        .from("answers_text")
        .select("*", { count: "exact", head: true })
        .eq("question_id", questionId)
        .eq("user_id", userId);

    if (responseAnswers.count) {
        return true;
    }

    const responseAnswersMatch = await supabase
        .from("answers_match")
        .select("id", { count: "exact", head: true })
        .eq("question_id", questionId)
        .eq("user_id", userId);

    return !!responseAnswersMatch.count;
};

export const fetchQuestion = async (questionId: number): Promise<QuestionDetailResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("questions").select("*, players (*), questions_pool(id, name)").eq("id", questionId).single();
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

export const setQuestionVisibility = async (questionId: number, visibility: boolean): Promise<QuestionResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("questions").update({ present_answers: visibility }).eq("id", questionId).select().single();
};
