"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ModerationService } from "@/lib/services/moderation.service";

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

export async function approveAgencyAction(
  agencyId: string
) {
  const admin = await ensureAdmin();

  const result =
    await ModerationService.approveAgency(
      agencyId,
      admin.id
    );

  if (!result.error) {
    revalidatePath("/admin");
    revalidatePath("/admin/moderation");
  }

  return result;
}

export async function rejectAgencyAction(
  agencyId: string
) {
  await ensureAdmin();

  const result =
    await ModerationService.rejectAgency(
      agencyId
    );

  if (!result.error) {
    revalidatePath("/admin");
    revalidatePath("/admin/moderation");
  }

  return result;
}