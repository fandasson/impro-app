"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { fetchQuestionState } from "@/api/questions.api";
import { MatchAnswer, MatchAnswerCreate, OptionsAnswer, OptionsAnswerInsert, TextAnswer, TextAnswerInsert, VoteAnswer, VoteAnswerInsert } from "@/api/types.api";
import { COOKIE_USER_ID } from "@/utils/constants.utils";
import { createClient } from "@/utils/supabase/server";

export const submitTextAnswer = async (answer: TextAnswerInsert) => {
    const cookieStore = await cookies();
    const supabase = await createClient();
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const { data: existing } = await supabase
        .from("answers_text")
        .select("id")
        .eq("question_id", answer.question_id)
        .eq("user_id", user_id)
        .limit(1)
        .single();

    let response;
    if (existing) {
        response = await supabase.from("answers_text").update({ value: answer.value }).eq("id", existing.id);
    } else {
        response = await supabase.from("answers_text").insert({ ...answer, user_id });
    }
    console.log("submit-answer", response.status);
};

export const submitOptionsAnswer = async (answer: OptionsAnswerInsert) => {
    const cookieStore = await cookies();
    const supabase = await createClient();
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const { data: existing } = await supabase
        .from("answers_options")
        .select("id")
        .eq("question_id", answer.question_id)
        .eq("user_id", user_id)
        .limit(1)
        .single();

    let response;
    if (existing) {
        response = await supabase.from("answers_options").update({ question_options_id: answer.question_options_id }).eq("id", existing.id);
    } else {
        response = await supabase.from("answers_options").insert({ ...answer, user_id });
    }
    console.log("submit-answer", response.status);
};

export const submitVoteAnswer = async (answer: VoteAnswerInsert) => {
    const cookieStore = await cookies();
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const supabase = await createClient();

    const state = await fetchQuestionState(answer.question_id);
    if (state !== "active") {
        return false;
    }

    const existingAnswerResponse = await supabase
        .from("answers_vote")
        .select("*")
        .eq("question_id", answer.question_id)
        .eq("user_id", user_id!)
        .single();

    let response: PostgrestSingleResponse<any>;
    if (existingAnswerResponse.data) {
        const answerId = existingAnswerResponse.data.id;
        response = await supabase.from("answers_vote").update({ player_id: answer.player_id }).eq("id", answerId);
    } else {
        response = await supabase.from("answers_vote").insert({ ...answer, user_id: user_id! });
    }
    // FIXME handle response
    console.log("submit-answer", response);
};

export const submitMatchAnswer = async (answers: MatchAnswerCreate[]) => {
    const cookieStore = await cookies();
    const supabase = await createClient();
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    // Delete existing matches for this question, then insert new ones
    if (answers.length > 0) {
        await supabase
            .from("answers_match")
            .delete()
            .eq("question_id", answers[0].question_id)
            .eq("user_id", user_id);
    }

    const responses = [];
    for (const answer of answers) {
        const response = await supabase.from("answers_match").insert({ ...answer, user_id });
        responses.push(response);
    }
    console.log("submit-answer", responses);
    revalidatePath("/[slug]", "page");
};

async function getUserId(): Promise<string> {
    const cookieStore = await cookies();
    const userId = cookieStore.get(COOKIE_USER_ID)?.value;
    if (!userId) {
        throw new Error("User not found");
    }
    return userId;
}

export const fetchMyTextAnswer = async (questionId: number): Promise<TextAnswer | null> => {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data } = await supabase
        .from("answers_text")
        .select("*")
        .eq("question_id", questionId)
        .eq("user_id", userId)
        .limit(1)
        .single();
    return data;
};

export const fetchMyVoteAnswer = async (questionId: number): Promise<VoteAnswer | null> => {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data } = await supabase
        .from("answers_vote")
        .select("*")
        .eq("question_id", questionId)
        .eq("user_id", userId)
        .limit(1)
        .single();
    return data;
};

export const fetchMyMatchAnswers = async (questionId: number): Promise<MatchAnswer[]> => {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data } = await supabase
        .from("answers_match")
        .select("*")
        .eq("question_id", questionId)
        .eq("user_id", userId);
    return data ?? [];
};

export const fetchMyOptionsAnswer = async (questionId: number): Promise<OptionsAnswer | null> => {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data } = await supabase
        .from("answers_options")
        .select("*")
        .eq("question_id", questionId)
        .eq("user_id", userId)
        .limit(1)
        .single();
    return data;
};
