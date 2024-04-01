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
      answers: {
        Row: {
          id: number
          question_id: number
          user_id: string
          value: string
        }
        Insert: {
          id?: number
          question_id: number
          user_id: string
          value: string
        }
        Update: {
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
      answers_match: {
        Row: {
          id: number
          player_id: number
          question_id: number
          user_id: string
          value: string
        }
        Insert: {
          id?: number
          player_id: number
          question_id: number
          user_id: string
          value: string
        }
        Update: {
          id?: number
          player_id?: number
          question_id?: number
          user_id?: string
          value?: string
        }
        Relationships: [
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
      performance_players: {
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
      performances: {
        Row: {
          available_colors: string[] | null
          available_names: string[] | null
          date: string
          id: number
          intro_text: string
          name: string
          note: string | null
          state: Database["public"]["Enums"]["performance-state"]
          url_slug: string
        }
        Insert: {
          available_colors?: string[] | null
          available_names?: string[] | null
          date: string
          id?: number
          intro_text: string
          name: string
          note?: string | null
          state: Database["public"]["Enums"]["performance-state"]
          url_slug: string
        }
        Update: {
          available_colors?: string[] | null
          available_names?: string[] | null
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
      players: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      question_players: {
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
      questions: {
        Row: {
          colors: string[] | null
          finish_at: string | null
          id: number
          index_order: number
          multiple: boolean
          name: string
          names: string[] | null
          performance_id: number
          present_answers: boolean | null
          question: string
          state: Database["public"]["Enums"]["question-state"]
          time_limit: number
          type: Database["public"]["Enums"]["question-type"]
        }
        Insert: {
          colors?: string[] | null
          finish_at?: string | null
          id?: number
          index_order: number
          multiple?: boolean
          name: string
          names?: string[] | null
          performance_id: number
          present_answers?: boolean | null
          question: string
          state: Database["public"]["Enums"]["question-state"]
          time_limit?: number
          type: Database["public"]["Enums"]["question-type"]
        }
        Update: {
          colors?: string[] | null
          finish_at?: string | null
          id?: number
          index_order?: number
          multiple?: boolean
          name?: string
          names?: string[] | null
          performance_id?: number
          present_answers?: boolean | null
          question?: string
          state?: Database["public"]["Enums"]["question-state"]
          time_limit?: number
          type?: Database["public"]["Enums"]["question-type"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_performance_id_fkey"
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
      [_ in never]: never
    }
    Enums: {
      "performance-state": "draft" | "intro" | "life" | "finished"
      "question-state": "draft" | "active" | "answered"
      "question-type": "color-pick" | "name-pick" | "text" | "match"
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
