"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
    AudienceVisibility,
    Character,
    Player,
    Question,
    QuestionDetail,
    QuestionOptions,
    QuestionState,
    QuestionUpsertRequest,
    QuestionWithPool,
} from "@/api/types.api";
import { COOKIE_USER_ID } from "@/utils/constants.utils";
import { createClient } from "@/utils/supabase/server";

type QuestionResponse = PostgrestSingleResponse<Question>;
type QuestionsResponse = PostgrestSingleResponse<QuestionWithPool[]>;
type QuestionDetailResponse = PostgrestSingleResponse<QuestionDetail>;

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

export const findQuestion = async (performanceId: number, filter: string): Promise<QuestionResponse> => {
    const supabase = createClient(cookies());
    return supabase.from("questions").select("*").eq("performance_id", performanceId).or(filter).limit(1).single();
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
    const questionResponse = await supabase
        .from("questions")
        .select("*, players (*), questions_pool(id, name)")
        .eq("id", questionId)
        .single();
    const characters = await supabase.from("characters").select().eq("question_id", questionId);
    if (questionResponse.data === null) {
        return questionResponse;
    }
    return { ...questionResponse, data: { ...questionResponse.data, characters: characters.data || [] } };
};

export const fetchQuestionState = async (questionId: number): Promise<QuestionState> => {
    const supabase = createClient(cookies());
    const response = await supabase.from("questions").select("state").eq("id", questionId).single();
    return response.data?.state ?? "draft";
};

export const fetchQuestions = async (performanceId: number): Promise<QuestionsResponse> => {
    const supabase = createClient(cookies());
    return supabase
        .from("questions")
        .select("*, questions_pool(id, name)")
        .eq("performance_id", performanceId)
        .order("index_order", { ascending: false });
};

export const fetchQuestionPlayers = async (questionId: number): Promise<Player[]> => {
    const supabase = createClient(cookies());
    const response = await supabase.from("questions").select("players(*)").eq("id", questionId).single();
    const players = response.data?.players ?? [];
    return players.sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchQuestionCharacters = async (questionId: number): Promise<Character[]> => {
    const supabase = createClient(cookies());
    const response = await supabase.from("characters").select().eq("question_id", questionId);
    return response.data ?? [];
};

export const fetchQuestionOptions = async (questionId: number): Promise<QuestionOptions[]> => {
    const supabase = createClient(cookies());
    const response = await supabase.from("questions_options").select().eq("question_id", questionId);
    return response.data ?? [];
};

export const setQuestionState = async (questionId: number, state: QuestionState): Promise<QuestionResponse> => {
    const supabase = createClient(cookies());
    // first, hide all visible
    await supabase.from("questions").update({ state: "answered" }).in("state", ["active", "locked"]);

    const response = await supabase.from("questions").update({ state }).eq("id", questionId).select().single();
    const performanceId = response.data?.performance_id;
    revalidatePath(`/admin/performances/${performanceId}`);
    revalidatePath(`/admin/question/${questionId}/view`);
    return response;
};

export const setAudienceVisibility = async (questionId: number, visibility: AudienceVisibility): Promise<void> => {
    const supabase = createClient(cookies());
    // first, hide visible
    await supabase.from("questions").update({ audience_visibility: "hidden" }).neq("audience_visibility", "hidden");

    // set required visibility
    await supabase.from("questions").update({ audience_visibility: visibility }).eq("id", questionId);
    revalidatePath(`/admin/question/${questionId}/view`);
};

export const getNewIndexOrder = async (performanceId: number): Promise<number> => {
    const supabase = createClient(cookies());
    const response = await supabase
        .from("questions")
        .select("index_order")
        .eq("performance_id", performanceId)
        .order("index_order", { ascending: false })
        .limit(1)
        .single();

    return response.data?.index_order ? response.data?.index_order + 1 : 1;
};

export const createQuestion = async (performanceId: number, question: QuestionUpsertRequest) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { players, ...questionData } = question;
    const response = await supabase
        .from("questions")
        .insert({
            ...questionData,
            state: "draft",
            performance_id: performanceId,
        })
        .select();

    const newQuestionId = response.data?.[0].id;
    if (!newQuestionId) {
        throw new Error("Question not created, can assign players");
    }

    const playersToInsert = players?.map(({ id }) => ({
        question_id: newQuestionId,
        player_id: id,
    }));
    if (playersToInsert) {
        await supabase.from("questions_players").insert(playersToInsert);
    }

    revalidatePath(`/admin/performances/${performanceId}`);
    return newQuestionId;
};

export const updateQuestion = async (questionId: number, question: QuestionUpsertRequest) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { players, ...questionData } = question;

    const response = await supabase
        .from("questions")
        .update({
            ...questionData,
        })
        .eq("id", questionId)
        .select();

    // assuming question is not updated after there is any voting submission
    // remove all assigned players
    await supabase.from("questions_players").delete().eq("question_id", questionId);

    // add new players
    const playersToInsert = players?.map(({ id }) => ({
        question_id: questionId,
        player_id: id,
    }));

    if (playersToInsert) {
        await supabase.from("questions_players").insert(playersToInsert);
    }

    revalidatePath(`/admin/questions/${questionId}/view`);
    return response.data?.[0];
};

export const hideAllForQuestion = async (questionId: number, performanceId: number) => {
    const supabase = createClient(cookies());
    await supabase.from("questions").update({ audience_visibility: "hidden", state: "answered" }).eq("id", questionId);
    revalidatePath(`/admin/performances/${performanceId}`);
};
