import { createClient } from "@/lib/supabase/server";

export class PaymentRepository {
  static async getPendingPayments() {
    const supabase = await createClient();

    return supabase
      .from("payment_submissions")
      .select(`
        *,
        profiles(
          full_name,
          phone_number
        )
      `)
      .eq("status", "pending")
      .order("created_at", {
        ascending: false,
      });
  }

  static async getPayment(id: string) {
    const supabase = await createClient();

    return supabase
      .from("payment_submissions")
      .select("*")
      .eq("id", id)
      .single();
  }

  static async approvePayment(
    paymentId: string,
    agentId: string,
    plan: "free" | "pro" | "premium",
    expiresAt: string
  ) {
    const supabase = await createClient();

    // Activation de l'abonnement
    const profile = await supabase
      .from("profiles")
      .update({
        plan,
        plan_expires_at: expiresAt,
      })
      .eq("id", agentId);

    if (profile.error) {
      return profile;
    }

    // Validation du paiement
    return supabase
      .from("payment_submissions")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .select()
      .single();
  }

  static async rejectPayment(paymentId: string) {
    const supabase = await createClient();

    return supabase
      .from("payment_submissions")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .select()
      .single();
  }
}