"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [agencies, setAgencies] = useState<PendingAgency[]>([]);

  const loadPending = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
          id,
          full_name,
          phone_number,
          created_at,
          avatar_url,
          website,
          adresse,
          verification_status,
          verified
        `
      )
      .eq("user_type", "agence")
      .eq("verification_status", "pending")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Erreur lors du chargement des agences en attente :",
        error
      );

      showToast(error.message, "error");
      setAgencies([]);
    } else {
      setAgencies(data ?? []);
    }

    setLoading(false);
  }, [showToast, supabase]);

  const approve = useCallback(
    async (id: string) => {
      const result = await approveAgencyAction(id);

      if (result.error) {
        showToast(result.error.message, "error");
        return;
      }

      showToast("Agence approuvée avec succès.", "success");

      await loadPending();
    },
    [loadPending, showToast]
  );

  const reject = useCallback(
    async (id: string) => {
      const result = await rejectAgencyAction(id);

      if (result.error) {
        showToast(result.error.message, "error");
        return;
      }

      showToast("Agence refusée.", "success");

      await loadPending();
    },
    [loadPending, showToast]
  );

  useEffect(() => {
    loadPending();

    const channel = supabase
      .channel("moderation-agencies")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          loadPending();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadPending, supabase]);

  return {
    loading,
    agencies,
    approve,
    reject,
    reload: loadPending,
  };
}