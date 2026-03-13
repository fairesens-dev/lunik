export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      abandoned_carts: {
        Row: {
          abandonment_stage: string
          cart_data: Json
          converted: boolean
          converted_order_id: string | null
          created_at: string
          email: string | null
          id: string
          last_email_sent_at: string | null
          promo_code_used: string | null
          session_id: string
          touch_count: number
          updated_at: string
        }
        Insert: {
          abandonment_stage?: string
          cart_data?: Json
          converted?: boolean
          converted_order_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_email_sent_at?: string | null
          promo_code_used?: string | null
          session_id: string
          touch_count?: number
          updated_at?: string
        }
        Update: {
          abandonment_stage?: string
          cart_data?: Json
          converted?: boolean
          converted_order_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_email_sent_at?: string | null
          promo_code_used?: string | null
          session_id?: string
          touch_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "abandoned_carts_converted_order_id_fkey"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          body: string | null
          contact_id: string
          created_at: string
          id: string
          metadata: Json | null
          performed_by: string | null
          subject: string | null
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          body?: string | null
          contact_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          subject?: string | null
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          body?: string | null
          contact_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          subject?: string | null
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data?: Json
          id: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_contacts: {
        Row: {
          campaign_id: string
          clicked_at: string | null
          contact_id: string
          id: string
          opened_at: string | null
          sent_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          campaign_id: string
          clicked_at?: string | null
          contact_id: string
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          campaign_id?: string
          clicked_at?: string | null
          contact_id?: string
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          clicks_count: number
          created_at: string
          created_by: string | null
          html_content: string | null
          id: string
          name: string
          opens_count: number
          preview_text: string | null
          recipients_count: number
          scheduled_at: string | null
          sender_email: string | null
          sender_name: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          subject: string | null
          type: Database["public"]["Enums"]["campaign_type"]
          unsubscribes_count: number
        }
        Insert: {
          clicks_count?: number
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          name: string
          opens_count?: number
          preview_text?: string | null
          recipients_count?: number
          scheduled_at?: string | null
          sender_email?: string | null
          sender_name?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subject?: string | null
          type?: Database["public"]["Enums"]["campaign_type"]
          unsubscribes_count?: number
        }
        Update: {
          clicks_count?: number
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          name?: string
          opens_count?: number
          preview_text?: string | null
          recipients_count?: number
          scheduled_at?: string | null
          sender_email?: string | null
          sender_name?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subject?: string | null
          type?: Database["public"]["Enums"]["campaign_type"]
          unsubscribes_count?: number
        }
        Relationships: []
      }
      configurator_settings: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data?: Json
          id: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      contact_properties: {
        Row: {
          contact_id: string
          id: string
          property_key: string
          property_value: string | null
          updated_at: string
        }
        Insert: {
          contact_id: string
          id?: string
          property_key: string
          property_value?: string | null
          updated_at?: string
        }
        Update: {
          contact_id?: string
          id?: string
          property_key?: string
          property_value?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_properties_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          job_title: string | null
          last_name: string
          last_seen_at: string | null
          lead_score: number
          lifecycle_stage: string | null
          phone: string | null
          source: Database["public"]["Enums"]["contact_source"]
          status: Database["public"]["Enums"]["contact_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email: string
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          last_seen_at?: string | null
          lead_score?: number
          lifecycle_stage?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["contact_source"]
          status?: Database["public"]["Enums"]["contact_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          last_seen_at?: string | null
          lead_score?: number
          lifecycle_stage?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["contact_source"]
          status?: Database["public"]["Enums"]["contact_status"]
          updated_at?: string
        }
        Relationships: []
      }
      conversions: {
        Row: {
          contact_id: string | null
          created_at: string
          currency: string | null
          event_category: string | null
          event_name: string
          event_value: number | null
          id: string
          metadata: Json | null
          page_url: string | null
          session_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          event_category?: string | null
          event_name: string
          event_value?: number | null
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          event_category?: string | null
          event_name?: string
          event_value?: number | null
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          armature_color: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string | null
          options: string[] | null
          phone: string | null
          postal_code: string | null
          processed: boolean
          projection: number | null
          toile_color: string | null
          width: number | null
        }
        Insert: {
          armature_color?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message?: string | null
          options?: string[] | null
          phone?: string | null
          postal_code?: string | null
          processed?: boolean
          projection?: number | null
          toile_color?: string | null
          width?: number | null
        }
        Update: {
          armature_color?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string | null
          options?: string[] | null
          phone?: string | null
          postal_code?: string | null
          processed?: boolean
          projection?: number | null
          toile_color?: string | null
          width?: number | null
        }
        Relationships: []
      }
      modals: {
        Row: {
          background_color: string
          body_text: string | null
          button_text: string | null
          button_url: string | null
          campaign_id: string | null
          conversions_count: number
          created_at: string
          display_frequency: Database["public"]["Enums"]["modal_frequency"]
          form_enabled: boolean
          form_fields: Json
          html_content: string | null
          id: string
          image_url: string | null
          impressions_count: number
          name: string
          redirect_url: string | null
          show_to: Database["public"]["Enums"]["modal_show_to"]
          status: Database["public"]["Enums"]["modal_status"]
          target_pages: string[] | null
          text_color: string
          title: string | null
          trigger_type: Database["public"]["Enums"]["modal_trigger"]
          trigger_value: string | null
          type: Database["public"]["Enums"]["modal_type"]
          updated_at: string
          webhook_url: string | null
          width_size: string
        }
        Insert: {
          background_color?: string
          body_text?: string | null
          button_text?: string | null
          button_url?: string | null
          campaign_id?: string | null
          conversions_count?: number
          created_at?: string
          display_frequency?: Database["public"]["Enums"]["modal_frequency"]
          form_enabled?: boolean
          form_fields?: Json
          html_content?: string | null
          id?: string
          image_url?: string | null
          impressions_count?: number
          name: string
          redirect_url?: string | null
          show_to?: Database["public"]["Enums"]["modal_show_to"]
          status?: Database["public"]["Enums"]["modal_status"]
          target_pages?: string[] | null
          text_color?: string
          title?: string | null
          trigger_type?: Database["public"]["Enums"]["modal_trigger"]
          trigger_value?: string | null
          type?: Database["public"]["Enums"]["modal_type"]
          updated_at?: string
          webhook_url?: string | null
          width_size?: string
        }
        Update: {
          background_color?: string
          body_text?: string | null
          button_text?: string | null
          button_url?: string | null
          campaign_id?: string | null
          conversions_count?: number
          created_at?: string
          display_frequency?: Database["public"]["Enums"]["modal_frequency"]
          form_enabled?: boolean
          form_fields?: Json
          html_content?: string | null
          id?: string
          image_url?: string | null
          impressions_count?: number
          name?: string
          redirect_url?: string | null
          show_to?: Database["public"]["Enums"]["modal_show_to"]
          status?: Database["public"]["Enums"]["modal_status"]
          target_pages?: string[] | null
          text_color?: string
          title?: string | null
          trigger_type?: Database["public"]["Enums"]["modal_trigger"]
          trigger_value?: string | null
          type?: Database["public"]["Enums"]["modal_type"]
          updated_at?: string
          webhook_url?: string | null
          width_size?: string
        }
        Relationships: [
          {
            foreignKeyName: "modals_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          armature_color: string | null
          civility: string | null
          client_address: string | null
          client_address2: string | null
          client_city: string | null
          client_country: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          client_postal_code: string | null
          created_at: string
          delivery_option: string | null
          emails_sent: Json
          id: string
          message: string | null
          newsletter_optin: boolean | null
          notes: string | null
          options: string[] | null
          payment_method: string | null
          payment_status: string | null
          projection: number
          promo_code: string | null
          promo_discount: number | null
          ref: string
          status: string
          status_history: Json | null
          stripe_payment_intent_id: string | null
          toile_color: string | null
          width: number
        }
        Insert: {
          amount: number
          armature_color?: string | null
          civility?: string | null
          client_address?: string | null
          client_address2?: string | null
          client_city?: string | null
          client_country?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          client_postal_code?: string | null
          created_at?: string
          delivery_option?: string | null
          emails_sent?: Json
          id?: string
          message?: string | null
          newsletter_optin?: boolean | null
          notes?: string | null
          options?: string[] | null
          payment_method?: string | null
          payment_status?: string | null
          projection: number
          promo_code?: string | null
          promo_discount?: number | null
          ref: string
          status?: string
          status_history?: Json | null
          stripe_payment_intent_id?: string | null
          toile_color?: string | null
          width: number
        }
        Update: {
          amount?: number
          armature_color?: string | null
          civility?: string | null
          client_address?: string | null
          client_address2?: string | null
          client_city?: string | null
          client_country?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          client_postal_code?: string | null
          created_at?: string
          delivery_option?: string | null
          emails_sent?: Json
          id?: string
          message?: string | null
          newsletter_optin?: boolean | null
          notes?: string | null
          options?: string[] | null
          payment_method?: string | null
          payment_status?: string | null
          projection?: number
          promo_code?: string | null
          promo_discount?: number | null
          ref?: string
          status?: string
          status_history?: Json | null
          stripe_payment_intent_id?: string | null
          toile_color?: string | null
          width?: number
        }
        Relationships: []
      }
      page_views: {
        Row: {
          city: string | null
          contact_id: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: string | null
          page_title: string | null
          page_url: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          city?: string | null
          contact_id?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          page_title?: string | null
          page_url: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          city?: string | null
          contact_id?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          page_title?: string | null
          page_url?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          current_uses: number
          first_purchase_only: boolean
          id: string
          max_uses: number | null
          type: string
          valid_from: string
          valid_until: string
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          current_uses?: number
          first_purchase_only?: boolean
          id?: string
          max_uses?: number | null
          type?: string
          valid_from?: string
          valid_until?: string
          value?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          current_uses?: number
          first_purchase_only?: boolean
          id?: string
          max_uses?: number | null
          type?: string
          valid_from?: string
          valid_until?: string
          value?: number
        }
        Relationships: []
      }
      site_content: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data?: Json
          id: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tag_plan: {
        Row: {
          created_at: string
          description: string | null
          destination: Database["public"]["Enums"]["tag_destination"]
          event_category: string | null
          event_name: string
          expected_value: string | null
          id: string
          implementation_status: Database["public"]["Enums"]["tag_impl_status"]
          trigger_description: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          destination?: Database["public"]["Enums"]["tag_destination"]
          event_category?: string | null
          event_name: string
          expected_value?: string | null
          id?: string
          implementation_status?: Database["public"]["Enums"]["tag_impl_status"]
          trigger_description?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          destination?: Database["public"]["Enums"]["tag_destination"]
          event_category?: string | null
          event_name?: string
          expected_value?: string | null
          id?: string
          implementation_status?: Database["public"]["Enums"]["tag_impl_status"]
          trigger_description?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      lookup_order: {
        Args: { p_email: string; p_ref: string }
        Returns: {
          amount: number
          armature_color: string
          client_email: string
          client_name: string
          created_at: string
          delivery_option: string
          options: string[]
          payment_status: string
          projection: number
          ref: string
          status: string
          status_history: Json
          toile_color: string
          width: number
        }[]
      }
    }
    Enums: {
      activity_type:
        | "email_sent"
        | "email_opened"
        | "email_clicked"
        | "sms_sent"
        | "page_view"
        | "form_submit"
        | "purchase"
        | "note"
        | "call"
      campaign_status: "draft" | "scheduled" | "sent"
      campaign_type: "newsletter" | "automation" | "transactional"
      contact_source:
        | "organic"
        | "paid"
        | "email"
        | "social"
        | "referral"
        | "direct"
      contact_status:
        | "visitor"
        | "lead"
        | "mql"
        | "sql"
        | "customer"
        | "churned"
      modal_frequency: "always" | "once" | "once_per_session"
      modal_show_to: "all" | "new" | "returning"
      modal_status: "active" | "paused" | "draft"
      modal_trigger:
        | "time_delay"
        | "scroll_percent"
        | "exit_intent"
        | "page_load"
      modal_type: "popup" | "slide_in" | "banner" | "exit_intent"
      tag_destination: "internal" | "ga4" | "meta" | "google_ads"
      tag_impl_status: "planned" | "implemented" | "verified"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "email_sent",
        "email_opened",
        "email_clicked",
        "sms_sent",
        "page_view",
        "form_submit",
        "purchase",
        "note",
        "call",
      ],
      campaign_status: ["draft", "scheduled", "sent"],
      campaign_type: ["newsletter", "automation", "transactional"],
      contact_source: [
        "organic",
        "paid",
        "email",
        "social",
        "referral",
        "direct",
      ],
      contact_status: ["visitor", "lead", "mql", "sql", "customer", "churned"],
      modal_frequency: ["always", "once", "once_per_session"],
      modal_show_to: ["all", "new", "returning"],
      modal_status: ["active", "paused", "draft"],
      modal_trigger: [
        "time_delay",
        "scroll_percent",
        "exit_intent",
        "page_load",
      ],
      modal_type: ["popup", "slide_in", "banner", "exit_intent"],
      tag_destination: ["internal", "ga4", "meta", "google_ads"],
      tag_impl_status: ["planned", "implemented", "verified"],
    },
  },
} as const
