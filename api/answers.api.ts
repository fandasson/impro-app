"use server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { Tables } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type AnswersResponse = PostgrestSingleResponse<Tables<"answers">[]>;
export const fetchAnswers = async (questionId: number): Promise<AnswersResponse> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    return supabase.from("answers").select("*").eq("question_id", questionId);
};
