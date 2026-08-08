import { PaymentRepository } from "@/lib/repositories/payment.repository";
import { NotificationService } from "@/lib/services/notification.service";
import { SubscriptionService } from "@/lib/services/subscription.service";

export type PlanCode = "pro" | "premium";

export class PaymentService {
  /**
   * Approuve un paiement et active/renouvelle
   * l'abonnement correspondant.
   */
  static async approve(
    paymentId: string,
    agentId: string,
    plan: PlanCode,
    months: number
  ) {
    /*
     * Validation des paramètres
     */
    if (!paymentId) {
      return {
        data: null,
        error: {
          message: "Identifiant du paiement manquant.",
        },
      };
    }

    if (!agentId) {
      return {
        data: null,
        error: {
          message: "Identifiant de l'agence manquant.",
        },
      };
    }

    if (!["pro", "premium"].includes(plan)) {
      return {
        data: null,
        error: {
          message: "Plan d'abonnement invalide.",
        },
      };
    }

    if (!Number.isInteger(months) || months <= 0) {
      return {
        data: null,
        error: {
          message: "La durée de l'abonnement est invalide.",
        },
      };
    }

    /*
     * Récupération du paiement
     */
    const payment =
      await PaymentRepository.getPayment(paymentId);

    if (payment.error || !payment.data) {
      console.error(
        "Paiement introuvable :",
        payment.error
      );

      return {
        data: null,
        error: {
          message: "Paiement introuvable.",
        },
      };
    }

    /*
     * Empêche une double validation.
     */
    if (payment.data.status !== "pending") {
      return {
        data: null,
        error: {
          message:
            "Ce paiement a déjà été traité.",
        },
      };
    }

    /*
     * Vérifie que le paiement appartient
     * bien à l'agence concernée.
     */
    if (payment.data.agent_id !== agentId) {
      return {
        data: null,
        error: {
          message:
            "Ce paiement ne correspond pas à cette agence.",
        },
      };
    }

    /*
     * Vérifie le plan.
     */
    if (payment.data.plan_requested !== plan) {
      return {
        data: null,
        error: {
          message:
            "Le plan demandé ne correspond pas au paiement.",
        },
      };
    }

    /*
     * Vérifie la durée.
     */
    if (payment.data.months_requested !== months) {
      return {
        data: null,
        error: {
          message:
            "La durée demandée ne correspond pas au paiement.",
        },
      };
    }

    /*
     * Validation du paiement.
     */
    const result =
      await PaymentRepository.approvePayment(
        paymentId
      );

    if (result.error) {
      console.error(
        "Erreur validation paiement :",
        result.error
      );

      return result;
    }

    /*
     * Activation / renouvellement de l'abonnement.
     *
     * Si l'abonnement actuel est encore actif
     * et correspond au même plan, SubscriptionService
     * prolongera l'abonnement à partir de sa date
     * d'expiration actuelle.
     */
    const subscription =
      await SubscriptionService.renewPlan(
        agentId,
        plan,
        months * 30
      );

    if (subscription.error) {
      console.error(
        "Erreur activation abonnement :",
        subscription.error
      );

      /*
       * Le paiement a déjà été approuvé.
       *
       * On retourne une erreur explicite afin que
       * l'administrateur sache que l'activation
       * nécessite une intervention.
       */
      return {
        data: null,
        error: {
          message:
            "Le paiement a été approuvé, mais l'activation de l'abonnement a échoué. Une intervention est nécessaire.",
        },
      };
    }

    /*
     * Notification de l'agence.
     *
     * IMPORTANT :
     * On vérifie maintenant explicitement le résultat
     * de l'insertion dans notifications.
     */
    const notification =
      await NotificationService.notify({
        agency_id: agentId,
        type: "subscription_approved",
        message:
          `Votre abonnement ${plan.toUpperCase()} a été activé pour ${months} mois.`,
      });

    /*
     * Si la notification n'a pas pu être créée,
     * on affiche l'erreur exacte.
     */
    if (notification.error) {
      console.error(
        "ERREUR CREATION NOTIFICATION :",
        notification.error
      );

      return {
        data: null,
        error: {
          message:
            `Abonnement activé, mais notification impossible : ${notification.error.message}`,
        },
      };
    }

    /*
     * Confirmation dans les logs serveur.
     */
    console.log(
      "NOTIFICATION CRÉÉE AVEC SUCCÈS :",
      notification.data
    );

    /*
     * Tout s'est correctement déroulé.
     */
    return {
      data: result.data,
      error: null,
    };
  }

  /**
   * Refuse un paiement.
   */
  static async reject(
    paymentId: string,
    agentId?: string
  ) {
    /*
     * Validation de l'identifiant.
     */
    if (!paymentId) {
      return {
        data: null,
        error: {
          message:
            "Identifiant du paiement manquant.",
        },
      };
    }

    /*
     * Vérification du paiement.
     */
    const payment =
      await PaymentRepository.getPayment(
        paymentId
      );

    if (payment.error || !payment.data) {
      console.error(
        "Paiement introuvable :",
        payment.error
      );

      return {
        data: null,
        error: {
          message: "Paiement introuvable.",
        },
      };
    }

    /*
     * Empêche le traitement d'un paiement
     * déjà traité.
     */
    if (payment.data.status !== "pending") {
      return {
        data: null,
        error: {
          message:
            "Ce paiement a déjà été traité.",
        },
      };
    }

    /*
     * Vérifie l'agence si elle est fournie.
     */
    if (
      agentId &&
      payment.data.agent_id !== agentId
    ) {
      return {
        data: null,
        error: {
          message:
            "Ce paiement ne correspond pas à cette agence.",
        },
      };
    }

    /*
     * Rejet du paiement.
     */
    const result =
      await PaymentRepository.rejectPayment(
        paymentId
      );

    if (result.error) {
      console.error(
        "Erreur rejet paiement :",
        result.error
      );

      return result;
    }

    /*
     * Notification de l'agence.
     */
    if (agentId) {
      const notification =
        await NotificationService.notify({
          agency_id: agentId,
          type: "subscription_rejected",
          message:
            "Votre demande d'abonnement a été refusée. Veuillez vérifier votre preuve de paiement ou contacter le support.",
        });

      /*
       * On ne considère pas le rejet comme
       * échoué si seule la notification échoue,
       * mais on log l'erreur explicitement.
       */
      if (notification.error) {
        console.error(
          "ERREUR CREATION NOTIFICATION DE REJET :",
          notification.error
        );
      } else {
        console.log(
          "NOTIFICATION DE REJET CRÉÉE AVEC SUCCÈS :",
          notification.data
        );
      }
    }

    return {
      data: result.data,
      error: null,
    };
  }

  /**
   * Retourne les paiements en attente.
   */
  static async getPendingPayments() {
    return PaymentRepository.getPendingPayments();
  }

  /**
   * Retourne un paiement précis.
   */
  static async getPayment(id: string) {
    return PaymentRepository.getPayment(id);
  }
}