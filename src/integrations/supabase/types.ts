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
      balloon_inventory: {
        Row: {
          color: string
          created_at: string | null
          id: number
          quantity: number
          size: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: number
          quantity?: number
          size: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: number
          quantity?: number
          size?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      balloon_styles: {
        Row: {
          created_at: string | null
          density_factor: number
          description: string | null
          id: number
          style_name: string
        }
        Insert: {
          created_at?: string | null
          density_factor: number
          description?: string | null
          id?: number
          style_name: string
        }
        Update: {
          created_at?: string | null
          density_factor?: number
          description?: string | null
          id?: number
          style_name?: string
        }
        Relationships: []
      }
      balloonformula: {
        Row: {
          accents: Json | null
          balloons_11in: number
          balloons_16in: number
          base_clusters: number
          extra_clusters: number
          grapes_quantity: number
          id: number
          littles_quantity: number
          shape: string | null
          shape_multiplier: number | null
          size_ft: number
          total_balloons: number
          total_clusters: number
          width_ft: number | null
        }
        Insert: {
          accents?: Json | null
          balloons_11in: number
          balloons_16in: number
          base_clusters: number
          extra_clusters: number
          grapes_quantity: number
          id?: number
          littles_quantity: number
          shape?: string | null
          shape_multiplier?: number | null
          size_ft: number
          total_balloons: number
          total_clusters: number
          width_ft?: number | null
        }
        Update: {
          accents?: Json | null
          balloons_11in?: number
          balloons_16in?: number
          base_clusters?: number
          extra_clusters?: number
          grapes_quantity?: number
          id?: number
          littles_quantity?: number
          shape?: string | null
          shape_multiplier?: number | null
          size_ft?: number
          total_balloons?: number
          total_clusters?: number
          width_ft?: number | null
        }
        Relationships: []
      }
      client_projects: {
        Row: {
          client_name: string
          created_at: string | null
          id: number
          project_name: string
        }
        Insert: {
          client_name: string
          created_at?: string | null
          id?: number
          project_name: string
        }
        Update: {
          client_name?: string
          created_at?: string | null
          id?: number
          project_name?: string
        }
        Relationships: []
      }
      design_image_analysis: {
        Row: {
          created_at: string | null
          detected_colors: Json
          id: number
          image_path: string
        }
        Insert: {
          created_at?: string | null
          detected_colors?: Json
          id?: number
          image_path: string
        }
        Update: {
          created_at?: string | null
          detected_colors?: Json
          id?: number
          image_path?: string
        }
        Relationships: []
      }
      production_details: {
        Row: {
          accents: Json
          balloons_11in: number
          balloons_16in: number
          base_clusters: number
          client_name: string
          colors: Json
          creation_date: string | null
          dimensions_ft: number
          extra_clusters: number
          grapes_quantity: number
          id: number
          littles_quantity: number
          production_time: string | null
          project_name: string
          shape: string
          total_balloons: number | null
          total_clusters: number
          width_ft: number | null
        }
        Insert: {
          accents?: Json
          balloons_11in: number
          balloons_16in: number
          base_clusters: number
          client_name: string
          colors?: Json
          creation_date?: string | null
          dimensions_ft: number
          extra_clusters: number
          grapes_quantity: number
          id?: number
          littles_quantity: number
          production_time?: string | null
          project_name: string
          shape?: string
          total_balloons?: number | null
          total_clusters: number
          width_ft?: number | null
        }
        Update: {
          accents?: Json
          balloons_11in?: number
          balloons_16in?: number
          base_clusters?: number
          client_name?: string
          colors?: Json
          creation_date?: string | null
          dimensions_ft?: number
          extra_clusters?: number
          grapes_quantity?: number
          id?: number
          littles_quantity?: number
          production_time?: string | null
          project_name?: string
          shape?: string
          total_balloons?: number | null
          total_clusters?: number
          width_ft?: number | null
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
