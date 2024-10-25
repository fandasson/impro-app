export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      answers_match: {
        Row: {
          character_id: number
          id: number
          player_id: number
          question_id: number
          user_id: string
        }
        Insert: {
          character_id: number
          id?: number
          player_id: number
          question_id: number
          user_id: string
        }
        Update: {
          character_id?: number
          id?: number
          player_id?: number
          question_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_match_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_match_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_match_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      answers_options: {
        Row: {
          id: number
          question_id: number
          question_options_id: number
          user_id: string
        }
        Insert: {
          id?: number
          question_id: number
          question_options_id: number
          user_id: string
        }
        Update: {
          id?: number
          question_id?: number
          question_options_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_options_question_options_id_fkey"
            columns: ["question_options_id"]
            isOneToOne: false
            referencedRelation: "questions_options"
            referencedColumns: ["id"]
          },
        ]
      }
      answers_text: {
        Row: {
          drawn: number | null
          favorite: boolean
          id: number
          question_id: number
          user_id: string
          value: string
        }
        Insert: {
          drawn?: number | null
          favorite?: boolean
          id?: number
          question_id: number
          user_id: string
          value: string
        }
        Update: {
          drawn?: number | null
          favorite?: boolean
          id?: number
          question_id?: number
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      answers_vote: {
        Row: {
          id: number
          player_id: number
          question_id: number
          user_id: string
        }
        Insert: {
          id?: number
          player_id: number
          question_id: number
          user_id: string
        }
        Update: {
          id?: number
          player_id?: number
          question_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_votes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          description: string | null
          id: number
          name: string
          question_id: number
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          question_id: number
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_names_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      performances: {
        Row: {
          date: string
          id: number
          intro_text: string
          name: string
          note: string | null
          state: Database["public"]["Enums"]["performance-state"]
          url_slug: string
        }
        Insert: {
          date: string
          id?: number
          intro_text: string
          name: string
          note?: string | null
          state: Database["public"]["Enums"]["performance-state"]
          url_slug: string
        }
        Update: {
          date?: string
          id?: number
          intro_text?: string
          name?: string
          note?: string | null
          state?: Database["public"]["Enums"]["performance-state"]
          url_slug?: string
        }
        Relationships: []
      }
      performances_players: {
        Row: {
          performance_id: number
          player_id: number
        }
        Insert: {
          performance_id: number
          player_id: number
        }
        Update: {
          performance_id?: number
          player_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "performance_players_performance_id_fkey"
            columns: ["performance_id"]
            isOneToOne: false
            referencedRelation: "performances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          id: number
          name: string
          quest: boolean | null
        }
        Insert: {
          id?: number
          name: string
          quest?: boolean | null
        }
        Update: {
          id?: number
          name?: string
          quest?: boolean | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          audience_visibility: Database["public"]["Enums"]["audience_visibility"]
          following_question_id: number | null
          id: number
          index_order: number
          multiple: boolean
          name: string
          performance_id: number
          pool_id: number | null
          question: string
          state: Database["public"]["Enums"]["question-state"]
          type: Database["public"]["Enums"]["question-type"]
        }
        Insert: {
          audience_visibility?: Database["public"]["Enums"]["audience_visibility"]
          following_question_id?: number | null
          id?: number
          index_order: number
          multiple?: boolean
          name: string
          performance_id: number
          pool_id?: number | null
          question: string
          state: Database["public"]["Enums"]["question-state"]
          type?: Database["public"]["Enums"]["question-type"]
        }
        Update: {
          audience_visibility?: Database["public"]["Enums"]["audience_visibility"]
          following_question_id?: number | null
          id?: number
          index_order?: number
          multiple?: boolean
          name?: string
          performance_id?: number
          pool_id?: number | null
          question?: string
          state?: Database["public"]["Enums"]["question-state"]
          type?: Database["public"]["Enums"]["question-type"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_following_question_id_fkey"
            columns: ["following_question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_performance_id_fkey"
            columns: ["performance_id"]
            isOneToOne: false
            referencedRelation: "performances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "questions_pool"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_options: {
        Row: {
          id: number
          option: string | null
          question_id: number
        }
        Insert: {
          id?: number
          option?: string | null
          question_id: number
        }
        Update: {
          id?: number
          option?: string | null
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_players: {
        Row: {
          player_id: number
          question_id: number
        }
        Insert: {
          player_id: number
          question_id: number
        }
        Update: {
          player_id?: number
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_players_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_pool: {
        Row: {
          audience_visibility: boolean
          id: number
          name: string | null
          performance_id: number
        }
        Insert: {
          audience_visibility?: boolean
          id?: number
          name?: string | null
          performance_id: number
        }
        Update: {
          audience_visibility?: boolean
          id?: number
          name?: string | null
          performance_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_pool_performance_id_fkey"
            columns: ["performance_id"]
            isOneToOne: false
            referencedRelation: "performances"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_match_results: {
        Args: {
          question_id_param: number
        }
        Returns: {
          player_id: number
          value: string
          count: number
        }[]
      }
      get_value_counts_by_player: {
        Args: {
          question_id_param: number
        }
        Returns: {
          player_id: number
          value: string
          count: number
        }[]
      }
    }
    Enums: {
      audience_visibility: "hidden" | "question" | "results"
      "performance-state": "draft" | "intro" | "life" | "finished"
      "question-state": "draft" | "active" | "locked" | "answered"
      "question-type": "text" | "player-pick" | "voting" | "match" | "options"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
