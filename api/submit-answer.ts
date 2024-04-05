"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { MatchAnswerCreate } from "@/api/types.api";
import { COOKIE_USER_ID } from "@/utils/constants.utils";
import { TablesInsert } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type Answer = Omit<TablesInsert<"answers">, "user_id">;
export const submitAnswer = async (answer: Answer) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const response = await supabase.from("answers").insert({ ...answer, user_id: user_id! });
    // FIXME handle response
    console.log("submit-answer", response);
};

export const resubmitAnswer = async (answer: Answer) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user_id = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!user_id) {
        throw new Error("User not found");
    }

    const existingAnswerResponse = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", answer.question_id)
        .eq("user_id", user_id!)
        .single();

    let response: PostgrestSingleResponse<any>;
    if (existingAnswerResponse.data) {
        const answerId = existingAnswerResponse.data.id;
        response = await supabase.from("answers").update({ value: answer.value }).eq("id", answerId);
    } else {
        response = await supabase.from("answers").insert({ ...answer, user_id: user_id! });
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
