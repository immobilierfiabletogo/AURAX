import { SubscriptionRepository } from "@/lib/repositories/subscription.repository";

type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "premium";

export class SubscriptionService {
  static async getPlans() {
    return SubscriptionRepository.getPlans();
  }

  static async getCurrentPlan(userId: string) {
    return SubscriptionRepository.getCurrentPlan(userId);
  }

  static async activatePlan(
    userId: string,
    plan: PlanCode,
    expiresAt: string | null
  ) {
    return SubscriptionRepository.updatePlan(
      userId,
      plan,
      expiresAt
    );
  }

  /**
   * Renouvelle un abonnement.
   * Si l'abonnement est encore actif, on ajoute la durée
   * à la date actuelle d'expiration.
   * Sinon, on repart d'aujourd'hui.
   */
  static async renewPlan(
    userId: string,
    plan: PlanCode,
    durationInDays: number
  ) {
    const profile =
      await SubscriptionRepository.getProfile(userId);

    if (!profile.data) {
      return {
        data: null,
        error: {
          message: "Profil introuvable",
        },
      };
    }

    let startDate = new Date();

    if (
      profile.data.plan === plan &&
      profile.data.plan_expires_at
    ) {
      const expires = new Date(
        profile.data.plan_expires_at
      );

      if (expires > startDate) {
        startDate = expires;
      }
    }

    const expiresAt = new Date(startDate);

    expiresAt.setDate(
      expiresAt.getDate() + durationInDays
    );

    return this.activatePlan(
      userId,
      plan,
      expiresAt.toISOString()
    );
  }

  /**
   * Vérifie automatiquement si l'abonnement
   * est expiré.
   *
   * Si oui :
   * - retour au plan gratuit
   * - mise à jour du profil
   */
  static async ensureSubscriptionIsValid(
    userId: string
  ) {
    const profile =
      await SubscriptionRepository.getProfile(userId);

    if (!profile.data) {
      return null;
    }

    let currentProfile = profile.data;

    if (
      currentProfile.plan !== "free" &&
      currentProfile.plan_expires_at
    ) {
      const expiresAt = new Date(
        currentProfile.plan_expires_at
      );

      if (expiresAt <= new Date()) {
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

    return currentProfile;
  }

  /**
   * Retourne toutes les informations
   * nécessaires au Dashboard.
   */
  static async getSubscriptionStatus(
    userId: string
  ) {
    const profile =
      await this.ensureSubscriptionIsValid(
        userId
      );

    if (!profile) {
      return null;
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        profile.plan ?? "free"
      );

    const expiresAt =
      profile.plan_expires_at;

    let remainingDays = 0;

    if (expiresAt) {
      remainingDays = Math.max(
        0,
        Math.ceil(
          (new Date(expiresAt).getTime() -
            Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      );
    }

    let notificationLevel:
      | "normal"
      | "warning7"
      | "warning3"
      | "expired" = "normal";

    if (remainingDays <= 0) {
      notificationLevel = "expired";
    } else if (remainingDays <= 3) {
      notificationLevel = "warning3";
    } else if (remainingDays <= 7) {
      notificationLevel = "warning7";
    }

    return {
      profile,
      plan: plan.data,
      expiresAt,
      remainingDays,
      expired:
        notificationLevel === "expired",
      renewalRecommended:
        remainingDays <= 7,
      notificationLevel,
    };
  }

  static async canPublish(userId: string) {
  const profile =
    await this.ensureSubscriptionIsValid(userId);

  if (!profile) {
    return {
      allowed: false,
      reason: "Profil introuvable",
    };
  }

  const plan =
    await SubscriptionRepository.getPlanByCode(
      profile.plan ?? "free"
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
    percentage:
      plan.data.max_listings === 0
        ? 100
        : Math.round(
            (used /
              plan.data.max_listings) *
              100
          ),
    plan: plan.data,
    reason:
      used >= plan.data.max_listings
        ? `Vous avez atteint la limite de ${plan.data.max_listings} annonces.`
        : undefined,
  };
}

static async canBoost(userId: string) {
  const profile =
    await this.ensureSubscriptionIsValid(userId);

  if (!profile) {
    return {
      allowed: false,
      reason: "Profil introuvable",
    };
  }

  const plan =
    await SubscriptionRepository.getPlanByCode(
      profile.plan ?? "free"
    );

  if (!plan.data) {
    return {
      allowed: false,
      reason: "Plan inconnu",
    };
  }

  if (plan.data.monthly_boosts >= 999999) {
    return {
      allowed: true,
      used: 0,
      limit: Infinity,
      remaining: Infinity,
      percentage: 0,
      unlimited: true,
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
    percentage:
      plan.data.monthly_boosts === 0
        ? 100
        : Math.round(
            (used /
              plan.data.monthly_boosts) *
              100
          ),
    unlimited: false,
    plan: plan.data,
    reason:
      used >= plan.data.monthly_boosts
        ? "Vous avez utilisé tous vos boosts ce mois-ci."
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
    await this.ensureSubscriptionIsValid(userId);

  if (!profile) {
    return {
      allowed: false,
      reason: "Profil introuvable",
    };
  }

  const plan =
    await SubscriptionRepository.getPlanByCode(
      profile.plan ?? "free"
    );

  if (!plan.data) {
    return {
      allowed: false,
      reason: "Plan inconnu",
    };
  }

  return {
    allowed:
      imageCount <= plan.data.max_images,
    requested: imageCount,
    limit: plan.data.max_images,
    remaining: Math.max(
      plan.data.max_images - imageCount,
      0
    ),
    plan: plan.data,
    reason:
      imageCount > plan.data.max_images
        ? `Votre abonnement ${plan.data.name} autorise ${plan.data.max_images} images maximum par annonce.`
        : undefined,
  };
}

static async remainingImages(
  userId: string
) {
  const profile =
    await this.ensureSubscriptionIsValid(userId);

  if (!profile) {
    return null;
  }

  const plan =
    await SubscriptionRepository.getPlanByCode(
      profile.plan ?? "free"
    );

  if (!plan.data) {
    return null;
  }

  return {
    limit: plan.data.max_images,
    plan: plan.data,
  };
}

static async getDashboardSubscription(
  userId: string
) {
  const [
    status,
    publication,
    boosts,
    images,
    premier,
  ] = await Promise.all([
    this.getSubscriptionStatus(userId),
    this.canPublish(userId),
    this.canBoost(userId),
    this.remainingImages(userId),
    this.getPremierSubscription(userId),
  ]);

  if (!status) {
    return null;
  }

  return {
    status,
    publication,
    boosts,
    images,
    premier,

    plan: status.plan,
    expiresAt: status.expiresAt,
    remainingDays: status.remainingDays,

    expired: status.expired,

    renewalRecommended:
      status.renewalRecommended,

    notificationLevel:
      status.notificationLevel,
  };
}


static async getPremierSubscription(
  userId: string
) {
  const [
    profile,
    leads,
  ] = await Promise.all([
    SubscriptionRepository.getProfile(userId),

    SubscriptionRepository.countClaimedRequestsThisMonth(
      userId
    ),
  ]);

  if (!profile.data) {
    return null;
  }

  const subscription =
    await SubscriptionRepository.getCurrentPlan(
      userId
    );

  const plan =
    subscription.data?.plan ?? "free";

  const limits: Record<
    string,
    number
  > = {
    free: 0,
    starter: 10,
    pro: 50,
    premium: Number.POSITIVE_INFINITY,
  };

  const leadLimit =
    limits[plan] ?? 0;

  const leadsUsed =
    leads.count ?? 0;

  return {
    subscription:
      subscription.data,

    plan,

    leadLimit,

    leadsUsed,

    remainingCredits:
      leadLimit ===
      Number.POSITIVE_INFINITY
        ? Number.POSITIVE_INFINITY
        : Math.max(
            0,
            leadLimit -
              leadsUsed
          ),

    unlimited:
      leadLimit ===
      Number.POSITIVE_INFINITY,
  };
}
}