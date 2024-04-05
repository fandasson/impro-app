import { Tables, TablesInsert } from "@/utils/supabase/entity.types";

export type Question = Tables<"questions"> & { players: Tables<"players">[] };

export type MatchAnswerResults = {
    player_id: number;
    value: string;
    count: number;
};
export type MatchAnswerCreate = Omit<TablesInsert<"answers_match">, "user_id">;

// ALIASES
export type Player = Tables<"players">;
export type Answer = Tables<"answers">;
