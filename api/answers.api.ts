"use server";
import { cookies } from "next/headers";

import {
    AnswersResponse,
    MatchAnswer,
    MatchAnswerResults,
    OptionsAnswer,
    TableNames,
    TextAnswer,
    VoteAnswer,
} from "@/api/types.api";
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

export const fetchMatchingAnswers = async (questionId: number): Promise<AnswersResponse<MatchAnswer>> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    return supabase.from("answers_match").select("*").eq("question_id", questionId);
};

export const fetchOptionsAnswers = async (questionId: number): Promise<AnswersResponse<OptionsAnswer>> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    return supabase.from("answers_options").select("*").eq("question_id", questionId);
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

export const favoriteTextAnswer = async (answersId: number, favorite: boolean): Promise<void> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.from("answers_text").update({ favorite }).eq("id", answersId).throwOnError();
};

export const randomDrawAnswer = async (answers: TextAnswer[]): Promise<void> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const notYetDrawn = answers.filter((a) => !a.drawn);
    const randomDraw = Math.floor(Math.random() * notYetDrawn.length);
    const drawIndex = Math.max(...answers.map((a) => a.drawn ?? 0));
    await supabase
        .from("answers_text")
        .update({ drawn: drawIndex + 1 })
        .eq("id", notYetDrawn[randomDraw].id)
        .throwOnError();
};

const removeAnswers = async (table: TableNames, answersIds: number[]): Promise<void> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.from(table).delete().in("id", answersIds).throwOnError();
};

export const areThereVotesForQuestion = async (questionId: number): Promise<boolean> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const response = await supabase
        .from("answers_vote")
        .select("id", { head: true, count: "exact" })
        .eq("question_id", questionId);
    return !!response.count;
};
