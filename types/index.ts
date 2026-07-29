import type { Database } from "./database";

export type Listing = Database['public']['Tables']['listings']['Row']
export type ListingInsert = Database['public']['Tables']['listings']['Insert']
export type ListingUpdate = Database['public']['Tables']['listings']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type AppSettings = Database['public']['Tables']['app_settings']['Row']
export type AppSettingsUpdate =
  Database['public']['Tables']['app_settings']['Update']

export interface PaymentSubmission {
  id: string;

  agent_id: string;

  plan_requested: string;

  months_requested: number;

  amount: number;

  reseau_paiement: string;

  screenshot_url: string;

  status: string;

  created_at: string;

  reviewed_at?: string | null;

  admin_note?: string | null;

  profiles?: {
    full_name: string;
    phone_number: string;
  };
}