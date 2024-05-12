import { PostgrestSingleResponse } from "@supabase/supabase-js";

import { Database, Enums, Tables, TablesInsert } from "@/utils/supabase/entity.types";

export type Question = Tables<"questions">;
export type QuestionWithPlayers = Question & { players: Player[] };
export type QuestionWithPool = Question & { questions_pool: Pick<Tables<"questions_pool">, "id" | "name"> | null };
export type QuestionDetail = QuestionWithPlayers & QuestionWithPool;
export type QuestionRequestCreate = Pick<Question, "name" | "question" | "type" | "index_order" | "multiple"> & {
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

export type MatchAnswerCreate = Omit<TablesInsert<"answers_match">, "user_id">;

export type TextAnswerInsert = Omit<TablesInsert<"answers_text">, "user_id">;
export type VoteAnswerInsert = Omit<TablesInsert<"answers_vote">, "user_id">;

// ALIASES
export type TableNames = keyof Database[Extract<keyof Database, "public">]["Tables"];
export type Player = Tables<"players">;
export type TextAnswer = Tables<"answers_text">;
export type VoteAnswer = Tables<"answers_vote">;
export type Performance = Tables<"performances">;

export type QuestionState = Enums<"question-state">;
export type QuestionType = Enums<"question-type">;
