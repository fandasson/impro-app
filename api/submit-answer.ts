"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { fetchQuestionState } from "@/api/questions.api";
import { MatchAnswerCreate, OptionsAnswerInsert, TextAnswerInsert, VoteAnswerInsert } from "@/api/types.api";
import { COOKIE_USER_ID } from "@/utils/constants.utils";
import { createClient } from "@/utils/supabase/server";

export const submitTextAnswer = async (answer: TextAnswerInsert) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const response = await supabase.from("answers_text").insert({ ...answer, user_id: user_id! });
    // FIXME handle response
    console.log("submit-answer", response.status);
};

export const submitOptionsAnswer = async (answer: OptionsAnswerInsert) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const response = await supabase.from("answers_options").insert({ ...answer, user_id: user_id! });
    // FIXME handle response
    console.log("submit-answer", response.status);
};

export const submitVoteAnswer = async (answer: VoteAnswerInsert) => {
    const cookieStore = cookies();
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const supabase = createClient(cookieStore);

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
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const responses = [];

    for (const answer of answers) {
        const response = await supabase.from("answers_match").insert({ ...answer, user_id: user_id! });
        responses.push(response);
    }
    // FIXME handle response
    console.log("submit-answer", responses);
    revalidatePath("/[slug]", "page");
};
