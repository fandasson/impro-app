"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Performance, Player, ServerActionResult } from "@/api/types.api";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";

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

// ============================================================================
// Validation schemas
// ============================================================================

const createPlayerSchema = z.object({
    name: z.string().min(1, "Jméno je povinné").max(255),
    surname: z.string().max(255).optional(),
    motto: z.string().max(500).optional(),
    quest: z.boolean().default(false),
});

const updatePlayerSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1, "Jméno je povinné").max(255).optional(),
    surname: z.string().max(255).optional().nullable(),
    motto: z.string().max(500).optional().nullable(),
    quest: z.boolean().optional(),
});

// ============================================================================
// Mutations
// ============================================================================

export async function createPlayer(input: {
    name: string;
    surname?: string;
    motto?: string;
    quest: boolean;
}): Promise<ServerActionResult<Player>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const validation = createPlayerSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: "Chyba validace",
                fieldErrors: validation.error.flatten().fieldErrors as Record<string, string[]>,
            };
        }

        const { name, surname, motto, quest } = validation.data;
        const { data, error } = await supabase
            .from("players")
            .insert({ name, surname: surname || null, motto: motto || null, quest })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/players");
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Neznámá chyba" };
    }
}

export async function updatePlayer(input: {
    id: number;
    name?: string;
    surname?: string | null;
    motto?: string | null;
    quest?: boolean;
}): Promise<ServerActionResult<Player>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const validation = updatePlayerSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: "Chyba validace",
                fieldErrors: validation.error.flatten().fieldErrors as Record<string, string[]>,
            };
        }

        const { id, ...updateData } = validation.data;
        const { data, error } = await supabase.from("players").update(updateData).eq("id", id).select().single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/players");
        revalidatePath(`/admin/players/${id}/edit`);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Neznámá chyba" };
    }
}

export const fetchPlayerPerformances = async (playerId: number): Promise<ServerActionResult<Performance[]>> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("performances_players")
        .select("performance:performances(*)")
        .eq("player_id", playerId);

    if (error) {
        return { success: false, error: error.message };
    }

    const performances = (data ?? []).map((row: any) => row.performance).filter(Boolean) as Performance[];

    performances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { success: true, data: performances };
};

export async function uploadPlayerPhoto(
    playerId: number,
    kind: "profile" | "body",
    formData: FormData,
): Promise<ServerActionResult<null>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const file = formData.get("photo") as File;
        if (!file || file.size === 0) {
            return { success: false, error: "Žádný soubor nebyl vybrán" };
        }

        const path = `${playerId}-${kind}.jpg`;
        const serviceClient = createServiceClient();

        const { error } = await serviceClient.storage.from("photos").upload(path, file, {
            contentType: "image/jpeg",
            cacheControl: "0",
            upsert: true,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath(`/admin/players/${playerId}/edit`);
        return { success: true, data: null };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Neznámá chyba" };
    }
}
