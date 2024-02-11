"use server";

import { cookies } from "next/headers";

import { TablesInsert } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type Answer = TablesInsert<"answers">;
export const submitAnswer = async (answer: Answer) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const response = await supabase.from("answers").insert(answer);
    // FIXME handle response
    console.log(response);
};
