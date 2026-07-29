'use client'

import { useState } from 'react'
import { createClient } from "@/lib/supabase/client";
import type { PaymentSubmission } from "@/types";

import {
  approvePaymentAction,
  rejectPaymentAction,
} from "@/app/admin/actions";

const ITEMS_PER_PAGE = 50;

export function usePayments(
  showToast: (text: string, type?: 'success' | 'error') => void
) {
  const supabase = createClient();

  const [payments, setPayments] =
    useState<PaymentSubmission[]>([]);

  const [loading, setLoading] = useState(false);

  const loadPayments = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("payment_submissions")
      .select(`
        *,
        profiles(
          full_name,
          phone_number
        )
      `)
      .order("created_at", { ascending: false })
      .range(0, ITEMS_PER_PAGE - 1);

    if (error) {
      showToast(error.message, "error");
    } else {
      setPayments(data ?? []);
    }

    setLoading(false);
  };

  const approvePayment = async (
    payment: PaymentSubmission
  ) => {
    setLoading(true);

    const result = await approvePaymentAction(
      payment.id,
      payment.agent_id,
      payment.plan_requested as
        | "free"
        | "pro"
        | "premium",
      payment.months_requested
    );

    if (result?.error) {
      showToast(result.error.message, "error");
    } else {
      showToast(
        "Abonnement activé avec succès."
      );

      await loadPayments();
    }

    setLoading(false);
  };

  const rejectPayment = async (
    payment: PaymentSubmission
  ) => {
    setLoading(true);

    const result =
  await rejectPaymentAction(
    payment.id,
    payment.agent_id
  );

    if (result?.error) {
      showToast(result.error.message, "error");
    } else {
      showToast("Paiement refusé.");

      await loadPayments();
    }

    setLoading(false);
  };

  return {
    payments,
    setPayments,
    loading,
    loadPayments,
    approvePayment,
    rejectPayment,
  };
}