import { Tables } from "@/utils/supabase/entity.types";

export type Question = Tables<"questions"> & { players: Tables<"players">[] };
