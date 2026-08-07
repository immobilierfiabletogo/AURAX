import { SubscriptionRepository } from "@/lib/repositories/subscription.repository";

type PlanCode = "pro" | "premium";

export class SubscriptionService {
  /**
   * Retourne les plans disponibles.
   *
   * L'architecture actuelle ne possède que :
   * - PRO
   * - PREMIUM
   */
  static async getPlans() {
    return SubscriptionRepository.getPlans();
  }

  /**
   * Retourne l'abonnement actuel d'une agence.
   */
  static async getCurrentPlan(userId: string) {
    return SubscriptionRepository.getCurrentPlan(userId);
  }

  /**
   * Active un abonnement.
   */
  static async activatePlan(
    userId: string,
    plan: PlanCode,
    expiresAt: string | null
  ) {
    return SubscriptionRepository.updatePlan(
      userId,
      plan,
      expiresAt,
      new Date().toISOString(),
      new Date().toISOString()
    );
  }

  /**
   * Renouvelle un abonnement.
   *
   * Si l'abonnement actuel est encore actif,
   * la nouvelle durée commence à sa date d'expiration.
   *
   * Sinon, le nouvel abonnement commence aujourd'hui.
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
   * Vérifie l'état réel de l'abonnement.
   *
   * IMPORTANT :
   * Il n'existe plus de rétrogradation vers "free".
   *
   * Si l'abonnement est expiré :
   * - le plan reste PRO ou PREMIUM ;
   * - la date d'expiration reste conservée ;
   * - le statut retourné devient "expired".
   *
   * Cela permet au Dashboard de rediriger correctement
   * l'agence vers la page d'abonnement.
   */
  static async ensureSubscriptionIsValid(
    userId: string
  ) {
    const profile =
      await SubscriptionRepository.getProfile(userId);

    if (!profile.data) {
      return null;
    }

    const currentProfile = profile.data;

    /**
     * Aucun abonnement valide si le plan n'est pas
     * PRO ou PREMIUM.
     */
    if (
      currentProfile.plan !== "pro" &&
      currentProfile.plan !== "premium"
    ) {
      return {
        ...currentProfile,
        subscription_status: "expired",
      };
    }

    /**
     * Si aucune date d'expiration n'existe,
     * l'abonnement ne peut pas être considéré comme actif.
     */
    if (!currentProfile.plan_expires_at) {
      return {
        ...currentProfile,
        subscription_status: "expired",
      };
    }

    const expiresAt = new Date(
      currentProfile.plan_expires_at
    );

    /**
     * Abonnement expiré.
     *
     * On NE change PAS le plan.
     * Il reste PRO ou PREMIUM afin de conserver
     * l'historique et d'afficher correctement
     * le dernier abonnement souscrit.
     */
    if (expiresAt <= new Date()) {
      return {
        ...currentProfile,
        subscription_status: "expired",
      };
    }

    return currentProfile;
  }

  /**
   * Retourne toutes les informations nécessaires
   * au Dashboard agence.
   */
  static async getSubscriptionStatus(
    userId: string
  ) {
    const profile =
      await this.ensureSubscriptionIsValid(userId);

    if (!profile) {
      return null;
    }

    const validPlan: PlanCode =
      profile.plan === "premium"
        ? "premium"
        : "pro";

    const plan =
      await SubscriptionRepository.getPlanByCode(
        validPlan
      );

    const expiresAt =
      profile.plan_expires_at;

    let remainingDays = 0;

    if (expiresAt) {
      remainingDays = Math.max(
        0,
        Math.ceil(
          (
            new Date(expiresAt).getTime() -
            Date.now()
          ) /
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

      startedAt:
        profile.subscription_started_at,

      approvedAt:
        profile.approved_at,

      expiresAt,

      subscriptionStatus:
        profile.subscription_status,

      verificationStatus:
        profile.verification_status,

      remainingDays,

      expired:
        notificationLevel === "expired",

      renewalRecommended:
        remainingDays <= 7,

      notificationLevel,
    };
  }

  /**
   * Vérifie si l'agence peut publier une annonce.
   */
  static async canPublish(userId: string) {
    const profile =
      await this.ensureSubscriptionIsValid(userId);

    if (!profile) {
      return {
        allowed: false,
        reason: "Profil introuvable",
      };
    }

    if (
      profile.subscription_status !== "active"
    ) {
      return {
        allowed: false,
        reason:
          "Votre abonnement est expiré. Veuillez renouveler votre abonnement.",
      };
    }

    if (
      !profile.plan_expires_at ||
      new Date(profile.plan_expires_at) <= new Date()
    ) {
      return {
        allowed: false,
        reason:
          "Votre abonnement est expiré. Veuillez renouveler votre abonnement.",
      };
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        profile.plan as PlanCode
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

    const limit = plan.data.max_listings;

    /**
     * Protection contre une limite inexistante.
     *
     * Si max_listings est null, on considère
     * qu'il n'y a pas de limite.
     */
    if (limit === null) {
      return {
        allowed: true,
        used,
        limit: null,
        remaining: null,
        percentage: 0,
        plan: plan.data,
      };
    }

    return {
      allowed: used < limit,

      used,

      limit,

      remaining: Math.max(
        limit - used,
        0
      ),

      percentage:
        limit === 0
          ? 100
          : Math.round(
              (used / limit) * 100
            ),

      plan: plan.data,

      reason:
        used >= limit
          ? `Vous avez atteint la limite de ${limit} annonces de votre abonnement ${plan.data.name}.`
          : undefined,
    };
  }

  /**
   * Vérifie si l'agence peut utiliser un boost.
   */
  static async canBoost(userId: string) {
    const profile =
      await this.ensureSubscriptionIsValid(userId);

    if (!profile) {
      return {
        allowed: false,
        reason: "Profil introuvable",
      };
    }

    if (
      profile.subscription_status !== "active"
    ) {
      return {
        allowed: false,
        reason:
          "Votre abonnement est expiré. Veuillez renouveler votre abonnement.",
      };
    }

    if (
      !profile.plan_expires_at ||
      new Date(profile.plan_expires_at) <= new Date()
    ) {
      return {
        allowed: false,
        reason:
          "Votre abonnement est expiré. Veuillez renouveler votre abonnement.",
      };
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        profile.plan as PlanCode
      );

    if (!plan.data) {
      return {
        allowed: false,
        reason: "Plan inconnu",
      };
    }

    /**
     * Une valeur très élevée représente
     * un nombre de boosts illimité.
     */
    if (
      plan.data.monthly_boosts >= 999999
    ) {
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

    const limit =
      plan.data.monthly_boosts;

    return {
      allowed: used < limit,

      used,

      limit,

      remaining: Math.max(
        limit - used,
        0
      ),

      percentage:
        limit === 0
          ? 100
          : Math.round(
              (used / limit) * 100
            ),

      unlimited: false,

      plan: plan.data,

      reason:
        used >= limit
          ? "Vous avez utilisé tous vos boosts ce mois-ci."
          : undefined,
    };
  }

  /**
   * Alias utilisé par certaines parties
   * de l'application.
   */
  static async remainingBoosts(
    userId: string
  ) {
    return this.canBoost(userId);
  }

  /**
   * Vérifie si l'agence peut uploader
   * un nombre donné d'images.
   */
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

    if (
      profile.subscription_status !== "active"
    ) {
      return {
        allowed: false,
        reason:
          "Votre abonnement est expiré. Veuillez renouveler votre abonnement.",
      };
    }

    if (
      !profile.plan_expires_at ||
      new Date(profile.plan_expires_at) <= new Date()
    ) {
      return {
        allowed: false,
        reason:
          "Votre abonnement est expiré. Veuillez renouveler votre abonnement.",
      };
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        profile.plan as PlanCode
      );

    if (!plan.data) {
      return {
        allowed: false,
        reason: "Plan inconnu",
      };
    }

    const limit =
      plan.data.max_images;

    return {
      allowed:
        imageCount <= limit,

      requested:
        imageCount,

      limit,

      remaining: Math.max(
        limit - imageCount,
        0
      ),

      plan: plan.data,

      reason:
        imageCount > limit
          ? `Votre abonnement ${plan.data.name} autorise ${limit} images maximum par annonce.`
          : undefined,
    };
  }

  /**
   * Retourne la limite d'images
   * de l'abonnement actuel.
   */
  static async remainingImages(
    userId: string
  ) {
    const profile =
      await this.ensureSubscriptionIsValid(userId);

    if (!profile) {
      return null;
    }

    if (
      profile.subscription_status !== "active"
    ) {
      return null;
    }

    if (
      !profile.plan_expires_at ||
      new Date(profile.plan_expires_at) <= new Date()
    ) {
      return null;
    }

    const plan =
      await SubscriptionRepository.getPlanByCode(
        profile.plan as PlanCode
      );

    if (!plan.data) {
      return null;
    }

    return {
      limit:
        plan.data.max_images,

      plan:
        plan.data,
    };
  }

  /**
   * Retourne toutes les informations nécessaires
   au Dashboard agence.
   */
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

      plan:
        status.plan,

      expiresAt:
        status.expiresAt,

      remainingDays:
        status.remainingDays,

      expired:
        status.expired,

      renewalRecommended:
        status.renewalRecommended,

      notificationLevel:
        status.notificationLevel,

      startedAt:
        status.startedAt,

      approvedAt:
        status.approvedAt,

      subscriptionStatus:
        status.subscriptionStatus,

      verificationStatus:
        status.verificationStatus,
    };
  }

  /**
   * Gestion de l'offre PREMIER.
   *
   * PRO :
   * 20 demandes / mois
   *
   * PREMIUM :
   * demandes illimitées
   */
  static async getPremierSubscription(
    userId: string
  ) {
    const [
      profile,
      leads,
    ] = await Promise.all([
      SubscriptionRepository.getProfile(
        userId
      ),

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

    const plan: PlanCode =
      subscription.data?.plan === "premium"
        ? "premium"
        : "pro";

    const limits: Record<
      PlanCode,
      number
    > = {
      pro: 20,

      premium:
        Number.POSITIVE_INFINITY,
    };

    const leadLimit =
      limits[plan];

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