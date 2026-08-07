
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
    paymentId: string
  ) {
    const supabase = await createClient();

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

  static async rejectPayment(
    paymentId: string
  ) {
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