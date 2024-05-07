"use server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { MatchAnswerResults } from "@/api/types.api";
import { Tables } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type AnswersResponse = PostgrestSingleResponse<Tables<"answers">[]>;

export const fetchAnswers = async (questionId: number): Promise<AnswersResponse> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    return supabase.from("answers").select("*").eq("question_id", questionId).neq("value", "");
};

export const fetchMatchingQuestionResults = async (questionId: number): Promise<MatchAnswerResults[] | null> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const response = await supabase.rpc("get_match_results", { question_id_param: questionId });
    return response.data;
};

export const removeAnswers = async (answersIds: number[]): Promise<void> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.from("answers").delete().in("id", answersIds).throwOnError();
};
