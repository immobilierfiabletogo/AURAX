import { createClient } from "@/lib/supabase/server";

export class AuthRepository {
  static async getSession() {
    const supabase = await createClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    return session;
  }

  static async getUser() {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return user;
  }

  static async isAdmin(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data?.is_admin === true;
  }

  static async signOut() {
    const supabase = await createClient();

    return supabase.auth.signOut();
  }
}