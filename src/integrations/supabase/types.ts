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
      animals: {
        Row: {
          address: string
          adopted_at: string | null
          adopter_contact: string | null
          adopter_email: string | null
          adopter_name: string | null
          count: number
          created_at: string
          health_condition: string
          id: string
          is_adopted: boolean | null
          is_emergency: boolean
          map_url: string
          photo_url: string | null
          qr_code_url: string
          type: string
          uploader_contact: string | null
          uploader_email: string
          uploader_name: string
        }
        Insert: {
          address: string
          adopted_at?: string | null
          adopter_contact?: string | null
          adopter_email?: string | null
          adopter_name?: string | null
          count: number
          created_at?: string
          health_condition: string
          id?: string
          is_adopted?: boolean | null
          is_emergency?: boolean
          map_url: string
          photo_url?: string | null
          qr_code_url: string
          type: string
          uploader_contact?: string | null
          uploader_email: string
          uploader_name: string
        }
        Update: {
          address?: string
          adopted_at?: string | null
          adopter_contact?: string | null
          adopter_email?: string | null
          adopter_name?: string | null
          count?: number
          created_at?: string
          health_condition?: string
          id?: string
          is_adopted?: boolean | null
          is_emergency?: boolean
          map_url?: string
          photo_url?: string | null
          qr_code_url?: string
          type?: string
          uploader_contact?: string | null
          uploader_email?: string
          uploader_name?: string
        }
        Relationships: []
      }
      deleted_animals: {
        Row: {
          address: string
          count: number
          created_at: string
          deleted_at: string
          health_condition: string
          id: string
          is_adopted: boolean | null
          is_emergency: boolean
          map_url: string
          photo_url: string | null
          qr_code_url: string
          type: string
          uploader_contact: string | null
          uploader_email: string
          uploader_name: string
        }
        Insert: {
          address: string
          count: number
          created_at?: string
          deleted_at?: string
          health_condition: string
          id?: string
          is_adopted?: boolean | null
          is_emergency?: boolean
          map_url: string
          photo_url?: string | null
          qr_code_url: string
          type: string
          uploader_contact?: string | null
          uploader_email: string
          uploader_name: string
        }
        Update: {
          address?: string
          count?: number
          created_at?: string
          deleted_at?: string
          health_condition?: string
          id?: string
          is_adopted?: boolean | null
          is_emergency?: boolean
          map_url?: string
          photo_url?: string | null
          qr_code_url?: string
          type?: string
          uploader_contact?: string | null
          uploader_email?: string
          uploader_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
