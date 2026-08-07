"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  approveAgencyAction,
  rejectAgencyAction,
} from "../actions/moderation";

export interface PendingAgency {
  id: string;
  full_name: string;
  phone_number: string;
  created_at: string;

  verification_status: string | null;
  verified: boolean | null;

  avatar_url: string | null;
  website: string | null;
  adresse: string | null;
}

export function useModeration(
  showToast: (
    message: string,
    type?: "success" | "error"
  ) => void
) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);

  const [agencies, setAgencies] =
    useState<PendingAgency[]>([]);

  async function loadPending() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        phone_number,
        created_at,
        avatar_url,
        website,
        adresse,
        verification_status,
        verified
      `)
      .eq("user_type", "agence")
      .eq("verification_status", "pending")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      showToast(error.message, "error");
    } else {
      setAgencies(data ?? []);
    }

    setLoading(false);
  }

  async function approve(id: string) {
    const result =
      await approveAgencyAction(id);

    if (result.error) {
      showToast(result.error.message, "error");
      return;
    }

    showToast(
      "Agence approuvée avec succès."
    );

    loadPending();
  }

  async function reject(id: string) {
    const result =
      await rejectAgencyAction(id);

    if (result.error) {
      showToast(result.error.message, "error");
      return;
    }

    showToast(
      "Agence refusée."
    );

    loadPending();
  }

  useEffect(() => {
    loadPending();

    const channel = supabase
      .channel("moderation")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => loadPending()
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    loading,
    agencies,
    approve,
    reject,
    reload: loadPending,
  };
}