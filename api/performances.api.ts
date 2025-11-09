"use server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { Performance, PerformanceState } from "@/api/types.api";
import { createClient } from "@/utils/supabase/server";

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
