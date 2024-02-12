"use server";

import { cookies } from "next/headers";

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
