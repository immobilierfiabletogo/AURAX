"use server";

import { revalidatePath } from "next/cache";
import { PaymentService } from "@/lib/services/payment.service";

export async function approvePaymentAction(
  paymentId: string,
  agentId: string,
  plan: "free" | "pro" | "premium",
  months: number
) {
  const result = await PaymentService.approve(
    paymentId,
    agentId,
    plan,
    months
  );

  revalidatePath("/admin");

  return result;
}

export async function rejectPaymentAction(
  paymentId: string,
  agentId: string
) {
  const result = await PaymentService.reject(
    paymentId,
    agentId
  );

  revalidatePath("/admin");

  return result;
}