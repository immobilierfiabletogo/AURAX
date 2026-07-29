'use server'

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PaymentService } from "@/lib/services/payment.service";

async function ensureAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Utilisateur non connecté.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) {
    throw new Error("Accès refusé.");
  }

  return user;
}

export async function approvePaymentAction(
  paymentId: string,
  agentId: string,
  plan: "free" | "pro" | "premium",
  months: number
) {
  await ensureAdmin();

  const result = await PaymentService.approve(
    paymentId,
    agentId,
    plan,
    months
  );

  if (!result.error) {
    revalidatePath("/admin");
    revalidatePath("/dashboard-agence");
    revalidatePath("/mon-espace");
  }

  return result;
}

export async function rejectPaymentAction(
  paymentId: string,
  agentId: string
) {
  await ensureAdmin();

  const result = await PaymentService.reject(
    paymentId,
    agentId
  );

  if (!result.error) {
    revalidatePath("/admin");
    revalidatePath("/dashboard-agence");
    revalidatePath("/mon-espace");
  }

  return result;
}