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
      affiliate_links: {
        Row: {
          code: string
          created_at: string
          earnings: number | null
          id: string
          product_id: string
          total_clicks: number | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          earnings?: number | null
          id?: string
          product_id: string
          total_clicks?: number | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          earnings?: number | null
          id?: string
          product_id?: string
          total_clicks?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      clicks: {
        Row: {
          affiliate_link_id: string | null
          clicked_at: string
          id: string
          ip_address: string | null
          is_reviewed: boolean | null
          is_valid: boolean | null
          product_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          affiliate_link_id?: string | null
          clicked_at?: string
          id?: string
          ip_address?: string | null
          is_reviewed?: boolean | null
          is_valid?: boolean | null
          product_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          affiliate_link_id?: string | null
          clicked_at?: string
          id?: string
          ip_address?: string | null
          is_reviewed?: boolean | null
          is_valid?: boolean | null
          product_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clicks_affiliate_link_id_fkey"
            columns: ["affiliate_link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_number: string
          created_at: string
          details: Json | null
          id: string
          is_default: boolean | null
          name: string
          type: string
          user_id: string
        }
        Insert: {
          account_number: string
          created_at?: string
          details?: Json | null
          id?: string
          is_default?: boolean | null
          name: string
          type: string
          user_id: string
        }
        Update: {
          account_number?: string
          created_at?: string
          details?: Json | null
          id?: string
          is_default?: boolean | null
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_details: Json | null
          payment_method: string | null
          processed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          payout_per_click: number | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          payout_per_click?: number | null
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          payout_per_click?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_details: Json | null
          amount: number
          created_at: string
          description: string | null
          id: string
          payment_method: string | null
          processed_at: string | null
          status: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          account_details?: Json | null
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status: string
          transaction_type: string
          user_id: string
        }
        Update: {
          account_details?: Json | null
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_withdrawal: boolean | null
          auto_withdrawal_method_id: string | null
          auto_withdrawal_threshold: number | null
          created_at: string
          dashboard_widgets: Json | null
          id: string
          language: string | null
          notification_app: boolean | null
          notification_email: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_withdrawal?: boolean | null
          auto_withdrawal_method_id?: string | null
          auto_withdrawal_threshold?: number | null
          created_at?: string
          dashboard_widgets?: Json | null
          id?: string
          language?: string | null
          notification_app?: boolean | null
          notification_email?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_withdrawal?: boolean | null
          auto_withdrawal_method_id?: string | null
          auto_withdrawal_threshold?: number | null
          created_at?: string
          dashboard_widgets?: Json | null
          id?: string
          language?: string | null
          notification_app?: boolean | null
          notification_email?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      top_affiliates: {
        Row: {
          clicks: number | null
          earnings: number | null
          id: string | null
          name: string | null
          photo: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_affiliate_earnings: {
        Args: { user_id: string }
        Returns: number
      }
      get_affiliate_weekly_earnings: {
        Args: { user_id: string }
        Returns: number
      }
      get_or_create_affiliate_link: {
        Args: { _user_id: string; _product_id: string }
        Returns: string
      }
      get_user_account_balance: {
        Args: { user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      record_affiliate_click: {
        Args:
          | {
              _affiliate_link_id: string
              _user_id: string
              _ip_address: string
              _user_agent: string
            }
          | {
              _affiliate_link_id: string
              _user_id: string
              _ip_address: string
              _user_agent: string
            }
        Returns: string
      }
      record_product_click: {
        Args: {
          _product_id: string
          _affiliate_user_id: string
          _visitor_user_id: string
          _user_agent: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "affiliate"
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
    Enums: {
      app_role: ["admin", "affiliate"],
    },
  },
} as const
