"use server";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { z } from "zod";
import slugify from "slugify";

import { Performance, PerformanceState } from "@/api/types.api";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/utils/supabase/entity.types";

type PerformanceResponse = PostgrestSingleResponse<Performance>;
type PerformancesResponse = PostgrestSingleResponse<Performance[]>;

export const fetchPerformances = async (): Promise<PerformancesResponse> => {
    const supabase = createClient(await cookies());
    return supabase.from("performances").select("*").order("date", { ascending: false });
};

export const fetchPerformance = async (performanceId: number): Promise<PerformanceResponse> => {
    const supabase = createClient(await cookies());
    return supabase.from("performances").select("*").eq("id", performanceId).single();
};

export const fetchVisiblePerformance = async (): Promise<PerformanceResponse> => {
    const supabase = createClient(await cookies());
    return supabase.from("performances").select("*").in("state", ["intro", "life", "closing"]).limit(1).single();
};

export const setPerformanceState = async (
    performanceId: number,
    state: PerformanceState,
): Promise<PerformanceResponse> => {
    const supabase = createClient(await cookies());
    return supabase.from("performances").update({ state }).eq("id", performanceId).select().single();
};

export const fetchAvailablePlayers = async (performanceId: number) => {
    const supabase = createClient(await cookies());
    const response = await supabase.from("performances").select("players(*)").eq("id", performanceId).single();
    const players = response.data?.players ?? [];
    return players.sort((a, b) => a.name.localeCompare(b.name));
};

// ============================================================================
// Types for new functionality
// ============================================================================

export type Player = Tables<"players">;

export type PerformanceWithPlayers = Performance & {
  players: Player[];
};

export type ServerActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ============================================================================
// Validation Schemas (T009)
// ============================================================================

const createPerformanceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  date: z.string().date("Invalid date format"),
  intro_text: z.string().max(10000, "Intro text too long").optional(),
  url_slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),
  state: z
    .enum(["draft", "intro", "life", "finished", "closing"])
    .default("draft"),
});

const updatePerformanceSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(255).optional(),
    date: z.string().date().optional(),
    intro_text: z.string().max(10000).optional(),
    url_slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    state: z.enum(["draft", "intro", "life", "finished", "closing"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field must be updated",
  });

const assignPlayerSchema = z.object({
  performance_id: z.number().int().positive(),
  player_id: z.number().int().positive(),
});

const removePlayerSchema = z.object({
  performance_id: z.number().int().positive(),
  player_id: z.number().int().positive(),
});

// ============================================================================
// Helper Functions
// ============================================================================

// Generates URL-safe slug from performance name with uniqueness guarantee
// If slug exists, appends -2, -3, etc. until unique (e.g., "letni-improvizace-2")
async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseName: string,
): Promise<string> {
  const baseSlug = slugify(baseName, { lower: true, strict: true });
  let finalSlug = baseSlug;
  let counter = 2;

  // Check uniqueness in database, increment counter if collision
  while (true) {
    const { data } = await supabase
      .from("performances")
      .select("id")
      .eq("url_slug", finalSlug)
      .maybeSingle();

    if (!data) break; // Slug is unique
    finalSlug = `${baseSlug}-${counter++}`;
  }

  return finalSlug;
}

// ============================================================================
// Fetch Actions with React.cache (T010, T011, T012)
// ============================================================================

export const fetchAllPerformances = cache(
  async (): Promise<ServerActionResult<Performance[]>> => {
    try {
      const supabase = createClient(await cookies());

      // Auth check
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "Unauthorized" };
      }

      const { data, error } = await supabase
        .from("performances")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

export const fetchPerformanceWithPlayers = cache(
  async (id: number): Promise<ServerActionResult<PerformanceWithPlayers>> => {
    try {
      const supabase = createClient(await cookies());

      // Auth check
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "Unauthorized" };
      }

      const { data, error } = await supabase
        .from("performances")
        .select(
          `
          *,
          performances_players(
            player:players(*)
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: "Performance not found" };
      }

      // Transform the nested structure to flat players array
      const players =
        data.performances_players?.map((pp: any) => pp.player).filter(Boolean) ||
        [];

      const performance: PerformanceWithPlayers = {
        ...data,
        players,
      };

      return { success: true, data: performance };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

export const fetchAllPlayers = cache(
  async (): Promise<ServerActionResult<Player[]>> => {
    try {
      const supabase = createClient(await cookies());

      // Auth check
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "Unauthorized" };
      }

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

// ============================================================================
// Mutation Actions (Placeholders - will be implemented in Phase 3+)
// ============================================================================

export async function createPerformance(
  input: z.infer<typeof createPerformanceSchema>,
): Promise<ServerActionResult<Performance>> {
  try {
    const supabase = createClient(await cookies());

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validation = createPerformanceSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validation.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const validatedInput = validation.data;

    // Generate slug if not provided
    const url_slug =
      validatedInput.url_slug ||
      (await generateUniqueSlug(supabase, validatedInput.name));

    // Create performance
    const { data, error } = await supabase
      .from("performances")
      .insert({
        name: validatedInput.name,
        date: validatedInput.date,
        intro_text: validatedInput.intro_text || "",
        url_slug,
        state: validatedInput.state || "draft",
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate admin pages
    revalidatePath("/admin");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updatePerformance(
  input: z.infer<typeof updatePerformanceSchema>,
): Promise<ServerActionResult<Performance>> {
  try {
    const supabase = createClient(await cookies());

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validation = updatePerformanceSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validation.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const validatedInput = validation.data;
    const { id, ...updateData } = validatedInput;

    // Check if slug uniqueness if being updated
    if (updateData.url_slug) {
      const { data: existing } = await supabase
        .from("performances")
        .select("id")
        .eq("url_slug", updateData.url_slug)
        .neq("id", id)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          error: "URL slug already exists",
          fieldErrors: { url_slug: ["Tato URL adresa již existuje"] },
        };
      }
    }

    // Update performance
    const { data, error } = await supabase
      .from("performances")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "Performance not found" };
    }

    // Revalidate admin pages
    revalidatePath("/admin");
    revalidatePath(`/admin/performances/${id}`);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function assignPlayerToPerformance(
  input: z.infer<typeof assignPlayerSchema>,
): Promise<ServerActionResult<void>> {
  try {
    const supabase = createClient(await cookies());

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validation = assignPlayerSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validation.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const { performance_id, player_id } = validation.data;

    // Insert with ON CONFLICT DO NOTHING (duplicate check)
    const { error } = await supabase
      .from("performances_players")
      .insert({ performance_id, player_id })
      .select();

    if (error) {
      // Check if duplicate error
      if (error.code === "23505") {
        return {
          success: false,
          error: "Player already assigned to this performance",
        };
      }
      return { success: false, error: error.message };
    }

    // Revalidate performance detail page
    revalidatePath(`/admin/performances/${performance_id}`);

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function removePlayerFromPerformance(
  input: z.infer<typeof removePlayerSchema>,
): Promise<ServerActionResult<void>> {
  try {
    const supabase = createClient(await cookies());

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validation = removePlayerSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validation.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const { performance_id, player_id } = validation.data;

    // Referential integrity check: prevent removing player if assigned to any questions
    // Uses JOIN to fetch all questions the player is assigned to via questions_players
    const { data: questionsData, error: checkError } = await supabase
      .from("questions_players")
      .select("question:questions!inner(performance_id)")
      .eq("player_id", player_id);

    if (checkError) {
      return { success: false, error: checkError.message };
    }

    // Filter to check if player is assigned to questions in THIS performance
    const hasQuestions = questionsData?.some(
      (qp: any) => qp.question?.performance_id === performance_id,
    );

    if (hasQuestions) {
      // Return Czech error message as specified in requirements
      return {
        success: false,
        error: "Hráč nemůže být odstraněn, protože je přiřazen k otázce.",
      };
    }

    // Safe to delete
    const { error } = await supabase
      .from("performances_players")
      .delete()
      .eq("performance_id", performance_id)
      .eq("player_id", player_id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate performance detail page
    revalidatePath(`/admin/performances/${performance_id}`);

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
