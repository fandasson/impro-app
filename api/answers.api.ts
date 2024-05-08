"use server";
import { cookies } from "next/headers";

import { AnswersResponse, MatchAnswerResults, TableNames, TextAnswer, VoteAnswer } from "@/api/types.api";
import { createClient } from "@/utils/supabase/server";

export const fetchTextAnswers = async (questionId: number): Promise<AnswersResponse<TextAnswer>> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    return supabase.from("answers_text").select("*").eq("question_id", questionId).neq("value", "");
};

export const fetchVoteAnswers = async (questionId: number): Promise<AnswersResponse<VoteAnswer>> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    return supabase.from("answers_vote").select("*").eq("question_id", questionId);
};

export const fetchPoolVoteAnswers = async (poolId: number): Promise<AnswersResponse<VoteAnswer>> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    return supabase.from("answers_vote").select("*, questions!inner(pool_id)").eq("questions.pool_id", poolId);
};

export const fetchMatchingQuestionResults = async (questionId: number): Promise<MatchAnswerResults[] | null> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const response = await supabase.rpc("get_match_results", { question_id_param: questionId });
    return response.data;
};

export const removeTextAnswers = async (answersIds: number[]): Promise<void> => {
    return removeAnswers("answers_text", answersIds);
};

const removeAnswers = async (table: TableNames, answersIds: number[]): Promise<void> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.from(table).delete().in("id", answersIds).throwOnError();
};
