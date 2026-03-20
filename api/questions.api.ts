"use server";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";

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
    const supabase = await createClient();
    return supabase
        .from("questions")
        .select("*")
        .eq("performance_id", performanceId)
        .or("state.eq.active,state.eq.locked")
        .limit(1)
        .single();
};

export const findQuestion = async (performanceId: number, filter: string): Promise<QuestionResponse> => {
    const supabase = await createClient();
    return supabase.from("questions").select("*").eq("performance_id", performanceId).or(filter).limit(1).single();
};

export const checkUserAlreadyAnswered = async (questionId: number): Promise<boolean> => {
    const cookieStore = await cookies();
    const supabase = await createClient();
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
    const supabase = await createClient();
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
    const supabase = await createClient();
    const response = await supabase.from("questions").select("state").eq("id", questionId).single();
    return response.data?.state ?? "draft";
};

export const fetchQuestions = async (performanceId: number): Promise<QuestionsResponse> => {
    const supabase = await createClient();
    return supabase
        .from("questions")
        .select("*, questions_pool(id, name)")
        .eq("performance_id", performanceId)
        .order("index_order", { ascending: false });
};

export const fetchQuestionPlayers = cache(async (questionId: number): Promise<Player[]> => {
    const supabase = await createClient();
    const response = await supabase.from("questions").select("players(*)").eq("id", questionId).single();
    const players = response.data?.players ?? [];
    return players.sort((a, b) => a.name.localeCompare(b.name));
});

export const fetchQuestionCharacters = async (questionId: number): Promise<Character[]> => {
    const supabase = await createClient();
    const response = await supabase.from("characters").select().eq("question_id", questionId);
    return response.data ?? [];
};

export const fetchAnsweredCharacterIds = async (questionId: number): Promise<number[]> => {
    const supabase = await createClient();
    const response = await supabase
        .from("answers_match")
        .select("character_id")
        .eq("question_id", questionId);
    if (!response.data) return [];
    return [...new Set(response.data.map((a) => a.character_id))];
};

export const fetchQuestionOptions = async (questionId: number): Promise<QuestionOptions[]> => {
    const supabase = await createClient();
    const response = await supabase
        .from("questions_options")
        .select()
        .eq("question_id", questionId)
        .order("id", { ascending: true });
    return response.data ?? [];
};

export const setQuestionState = async (questionId: number, state: QuestionState): Promise<QuestionResponse> => {
    const supabase = await createClient();
    // first, hide all visible
    await supabase.from("questions").update({ state: "answered" }).in("state", ["active", "locked"]);

    const response = await supabase.from("questions").update({ state }).eq("id", questionId).select().single();
    const performanceId = response.data?.performance_id;
    revalidatePath(`/admin/performances/${performanceId}`);
    revalidatePath(`/admin/question/${questionId}/view`);
    return response;
};

export const setAudienceVisibility = async (questionId: number, visibility: AudienceVisibility): Promise<void> => {
    const supabase = await createClient();
    // first, hide visible
    await supabase.from("questions").update({ audience_visibility: "hidden" }).neq("audience_visibility", "hidden");
    // hide pools
    await supabase.from("questions_pool").update({ audience_visibility: false }).eq("audience_visibility", true);

    // set required visibility
    await supabase.from("questions").update({ audience_visibility: visibility }).eq("id", questionId);
    revalidatePath(`/admin/question/${questionId}/view`);
};

export const getNewIndexOrder = async (performanceId: number): Promise<number> => {
    const supabase = await createClient();
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
    const supabase = await createClient();
    const { players, characters, ...questionData } = question;
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

    if (characters?.length) {
        const charactersToInsert = characters.map(({ name, description }) => ({
            question_id: newQuestionId,
            name,
            description: description ?? null,
        }));
        await supabase.from("characters").insert(charactersToInsert);
    }

    revalidatePath(`/admin/performances/${performanceId}`);
    return newQuestionId;
};

export const updateQuestion = async (questionId: number, question: QuestionUpsertRequest) => {
    const supabase = await createClient();
    const { players, characters, ...questionData } = question;

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

    // sync characters for match questions
    if (characters !== undefined) {
        const existingChars = await supabase
            .from("characters")
            .select("id")
            .eq("question_id", questionId);
        const existingIds = new Set((existingChars.data ?? []).map((c) => c.id));
        const submittedIds = new Set(characters.filter((c) => c.id !== undefined).map((c) => c.id!));

        // delete removed characters (FK constraint prevents if answers exist)
        const toDelete = [...existingIds].filter((id) => !submittedIds.has(id));
        if (toDelete.length > 0) {
            await supabase.from("characters").delete().in("id", toDelete);
        }

        // update existing characters
        for (const char of characters.filter((c) => c.id !== undefined)) {
            await supabase
                .from("characters")
                .update({ name: char.name, description: char.description ?? null })
                .eq("id", char.id!);
        }

        // insert new characters
        const newChars = characters
            .filter((c) => c.id === undefined)
            .map(({ name, description }) => ({
                question_id: questionId,
                name,
                description: description ?? null,
            }));
        if (newChars.length > 0) {
            await supabase.from("characters").insert(newChars);
        }
    }

    revalidatePath(`/admin/questions/${questionId}/view`);
    return response.data?.[0];
};

export const fetchExcludedPlayerIdsForChain = async (questionId: number): Promise<number[]> => {
    const cookieStore = await cookies();
    const userId = cookieStore.get(COOKIE_USER_ID)?.value;
    if (!userId) {
        return [];
    }

    const supabase = await createClient();

    // Walk backwards through the chain collecting predecessor question IDs
    const predecessorIds: number[] = [];
    let currentId = questionId;
    const visited = new Set<number>();

    while (true) {
        if (visited.has(currentId)) break; // cycle guard
        visited.add(currentId);

        const { data } = await supabase
            .from("questions")
            .select("id")
            .eq("following_question_id", currentId)
            .limit(1)
            .single();

        if (!data) break;
        predecessorIds.push(data.id);
        currentId = data.id;
    }

    if (predecessorIds.length === 0) {
        return [];
    }

    // Fetch player_ids from user's answers to all predecessor questions
    const { data: answers } = await supabase
        .from("answers_match")
        .select("player_id")
        .eq("user_id", userId)
        .in("question_id", predecessorIds);

    if (!answers) {
        return [];
    }

    return [...new Set(answers.map((a) => a.player_id))];
};

export const fetchFirstQuestionInChain = async (questionId: number): Promise<number | null> => {
    const supabase = await createClient();

    // Walk backwards through chain via following_question_id pointers
    let currentId = questionId;
    const visited = new Set<number>();
    let foundPredecessor = false;

    while (true) {
        if (visited.has(currentId)) break; // cycle guard
        visited.add(currentId);

        const { data } = await supabase
            .from("questions")
            .select("id")
            .eq("following_question_id", currentId)
            .limit(1)
            .single();

        if (!data) break;
        foundPredecessor = true;
        currentId = data.id;
    }

    if (!foundPredecessor) {
        // Check if this question itself has a following_question_id (i.e., it's the start of a chain)
        const { data } = await supabase
            .from("questions")
            .select("following_question_id")
            .eq("id", questionId)
            .single();

        if (!data?.following_question_id) {
            return null; // Not part of any chain
        }
        return questionId; // This question IS the first in the chain
    }

    return currentId;
};

export const hideAllForQuestion = async (questionId: number, performanceId: number) => {
    const supabase = await createClient();
    await supabase.from("questions").update({ audience_visibility: "hidden", state: "answered" }).eq("id", questionId);
    revalidatePath(`/admin/performances/${performanceId}`);
};
