import { SubscriptionRepository } from "@/lib/repositories/subscription.repository";

export class SubscriptionService {
  static async getPlans() {
    return SubscriptionRepository.getPlans();
  }

  static async getCurrentPlan(userId: string) {
    return SubscriptionRepository.getCurrentPlan(userId);
  }

  static async activatePlan(
    userId: string,
    plan: "free" | "pro" | "premium",
    expiresAt: string | null
  ) {
    return SubscriptionRepository.updatePlan(
      userId,
      plan,
      expiresAt
    );
  }

  static async canPublish(userId: string) {
    const profile =
      await SubscriptionRepository.getProfile(userId);

    if (!profile.data) {
      return {
        allowed: false,
        reason: "Profil introuvable",
      };
    }

    let currentProfile = profile.data;

    // Vérification automatique de l'expiration
    if (
      currentProfile.plan !== "free" &&
      currentProfile.plan_expires_at
    ) {
      const expiresAt = new Date(
        currentProfile.plan_expires_at
      );

      if (expiresAt < new Date()) {
        await SubscriptionRepository.updatePlan(
          userId,
          "free",
          null
        );

        currentProfile = {
          ...currentProfile,
          plan: "free",
          plan_expires_at: null,
        };
      }
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        currentProfile.plan ?? "free"
      );

    if (!plan.data) {
      return {
        allowed: false,
        reason: "Plan inconnu",
      };
    }

    const listings =
      await SubscriptionRepository.countListings(
        userId
      );

    const used = listings.count ?? 0;

    return {
      allowed: used < plan.data.max_listings,
      used,
      limit: plan.data.max_listings,
      remaining: Math.max(
        plan.data.max_listings - used,
        0
      ),
      plan: plan.data,
    };
  }

  static async canBoost(userId: string) {
    const profile =
      await SubscriptionRepository.getProfile(userId);

    if (!profile.data) {
      return {
        allowed: false,
        reason: "Profil introuvable",
      };
    }

    let currentProfile = profile.data;

    // Vérification automatique de l'expiration
    if (
      currentProfile.plan !== "free" &&
      currentProfile.plan_expires_at
    ) {
      const expiresAt = new Date(
        currentProfile.plan_expires_at
      );

      if (expiresAt < new Date()) {
        await SubscriptionRepository.updatePlan(
          userId,
          "free",
          null
        );

        currentProfile = {
          ...currentProfile,
          plan: "free",
          plan_expires_at: null,
        };
      }
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        currentProfile.plan ?? "free"
      );

    if (!plan.data) {
      return {
        allowed: false,
        reason: "Plan inconnu",
      };
    }

    // Premium = boosts illimités
    if (plan.data.monthly_boosts >= 999999) {
      return {
        allowed: true,
        used: 0,
        limit: Infinity,
        remaining: Infinity,
        plan: plan.data,
      };
    }

    const boosts =
      await SubscriptionRepository.countBoostsThisMonth(
        userId
      );

    const used = boosts.count ?? 0;

    return {
      allowed: used < plan.data.monthly_boosts,
      used,
      limit: plan.data.monthly_boosts,
      remaining: Math.max(
        plan.data.monthly_boosts - used,
        0
      ),
      plan: plan.data,
      reason:
        used >= plan.data.monthly_boosts
          ? "Vous avez utilisé tous vos boosts du mois."
          : undefined,
    };
  }

  static async remainingBoosts(userId: string) {
    return this.canBoost(userId);
  }

  static async canUploadImages(
    userId: string,
    imageCount: number
  ) {
    const profile =
      await SubscriptionRepository.getProfile(userId);

    if (!profile.data) {
      return {
        allowed: false,
        reason: "Profil introuvable",
      };
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        profile.data.plan ?? "free"
      );

    if (!plan.data) {
      return {
        allowed: false,
        reason: "Plan inconnu",
      };
    }

    if (imageCount > plan.data.max_images) {
      return {
        allowed: false,
        reason: `Votre abonnement ${plan.data.name} autorise au maximum ${plan.data.max_images} images par annonce.`,
      };
    }

    return {
      allowed: true,
      limit: plan.data.max_images,
      plan: plan.data,
    };
  }

  static async remainingImages(userId: string) {
    const profile =
      await SubscriptionRepository.getProfile(userId);

    if (!profile.data) {
      return null;
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        profile.data.plan ?? "free"
      );

    return plan.data;
  }

  static async expireSubscriptions() {
    throw new Error("Not implemented");
  }

  static async activatePayment(paymentId: string) {
    throw new Error("Not implemented");
  }

  static async getPremierSubscription(userId: string) {
   const [profile, leads] = await Promise.all([
     SubscriptionRepository.getProfile(userId),
     SubscriptionRepository.countClaimedRequestsThisMonth(userId),
   ]);

   if (!profile.data) {
     return null;
   }

   const subscription =
     await SubscriptionRepository.getCurrentPlan(userId);

   const plan = subscription.data?.plan ?? "free";

   const limits: Record<string, number> = {
     free: 0,
     starter: 10,
     pro: 50,
     premium: Number.POSITIVE_INFINITY,
   };

   const leadLimit = limits[plan] ?? 0;

   const leadsUsed = leads.count ?? 0;

   return {
     subscription: subscription.data,
     plan,
     leadLimit,
     leadsUsed,
     remainingCredits:
       leadLimit === Number.POSITIVE_INFINITY
         ? Number.POSITIVE_INFINITY
         : Math.max(0, leadLimit - leadsUsed),
   };
 }
}