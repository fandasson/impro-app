"use server";
import { revalidatePath } from "next/cache";

import type { Player, ServerActionResult } from "@/api/types.api";
import { createClient } from "@/utils/supabase/server";

export const fetchPlayers = async (): Promise<ServerActionResult<Player[]>> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("players").select("*").order("name");
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data: data ?? [] };
};

export const fetchPlayer = async (id: number): Promise<ServerActionResult<Player>> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("players").select("*").eq("id", id).single();
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data };
};
