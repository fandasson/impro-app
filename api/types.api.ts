import { PostgrestSingleResponse } from "@supabase/supabase-js";

import { Database, Enums, Tables, TablesInsert } from "@/utils/supabase/entity.types";

export type QuestionWithPlayersAndCharacters = Question & { players: Player[]; characters: Character[] };
export type QuestionWithPool = Question & { questions_pool: Pick<Tables<"questions_pool">, "id" | "name"> | null };
export type QuestionDetail = QuestionWithPlayersAndCharacters & QuestionWithPool;
export type QuestionUpsertRequest = Pick<
    Question,
    "name" | "question" | "type" | "index_order" | "multiple" | "pool_id"
> & {
    players?: Player[];
};

export type Answer = {
    id: number;
    question_id: number;
    user_id: string;
};

export type AnswersResponse<T extends Answer = Answer> = PostgrestSingleResponse<T[]>;
export type MatchAnswerResults = {
    player_id: number;
    value: string;
    count: number;
};

export type VotedPlayer<T extends Player = Player> = T & {
    count: number;
};

export type PlayerWithPhotos = Player & {
    photos: {
        body: string;
        profile: string;
    };
};

export type MatchAnswerCreate = Omit<TablesInsert<"answers_match">, "user_id">;
export type TextAnswerInsert = Omit<TablesInsert<"answers_text">, "user_id">;
export type VoteAnswerInsert = Omit<TablesInsert<"answers_vote">, "user_id">;
export type OptionsAnswerInsert = Omit<TablesInsert<"answers_options">, "user_id">;

// ALIASES
export type TableNames = keyof Database[Extract<keyof Database, "public">]["Tables"];
export type Player = Tables<"players">;
export type Character = Tables<"characters">;
export type TextAnswer = Tables<"answers_text">;
export type VoteAnswer = Tables<"answers_vote">;
export type OptionsAnswer = Tables<"answers_options">;
export type MatchAnswer = Tables<"answers_match">;
export type Performance = Tables<"performances">;
export type Question = Tables<"questions">;
export type QuestionOptions = Tables<"questions_options">;
export type QuestionPool = Tables<"questions_pool">;

export type QuestionState = Enums<"question-state">;
export type QuestionType = Enums<"question-type">;
export type AudienceVisibility = Enums<"audience_visibility">;
export type PerformanceState = Enums<"performance-state">;

// Performance Management Types (T008)
export type PerformanceWithPlayers = Performance & {
  players: Player[];
};

export type PerformanceFormData = {
  name: string;
  date: string; // ISO 8601
  intro_text?: string;
  url_slug?: string;
  state?: "draft" | "intro" | "life" | "finished" | "closing";
};

export type ServerActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
