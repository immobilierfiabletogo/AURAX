import { PaymentRepository } from "@/lib/repositories/payment.repository";
import { NotificationService } from "@/lib/services/notification.service";
import { SubscriptionService } from "@/lib/services/subscription.service";

export type PlanCode = "pro" | "premium";

export class PaymentService {
  static async approve(
    paymentId: string,
    agentId: string,
    plan: PlanCode,
    months: number
  ) {
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
          message:
            "La durée de l'abonnement est invalide.",
        },
      };
    }

    /*
     * Vérification du paiement avant toute modification.
     */
    const payment =
      await PaymentRepository.getPayment(
        paymentId
      );

    if (payment.error || !payment.data) {
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
     * Vérifie que le paiement correspond
     * bien à l'agence et au plan demandés.
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

    if (
      payment.data.plan_requested !== plan
    ) {
      return {
        data: null,
        error: {
          message:
            "Le plan demandé ne correspond pas au paiement.",
        },
      };
    }

    if (
      payment.data.months_requested !== months
    ) {
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
      return result;
    }

    /*
     * Activation / renouvellement de l'abonnement
     * uniquement après validation du paiement.
     */
    const subscription =
      await SubscriptionService.renewPlan(
        agentId,
        plan,
        months * 30
      );

    if (subscription.error) {
      /*
       * Le paiement est déjà marqué comme approuvé.
       * On retourne l'erreur afin que le problème
       * soit visible et puisse être traité côté admin.
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
     */
    await NotificationService.notify({
      agency_id: agentId,
      type: "subscription_approved",
      message: `Votre abonnement ${plan.toUpperCase()} a été activé pour ${months} mois.`,
    });

    return {
      data: result.data,
      error: null,
    };
  }

  static async reject(
    paymentId: string,
    agentId?: string
  ) {
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
     * Vérification avant rejet.
     */
    const payment =
      await PaymentRepository.getPayment(
        paymentId
      );

    if (payment.error || !payment.data) {
      return {
        data: null,
        error: {
          message: "Paiement introuvable.",
        },
      };
    }

    if (payment.data.status !== "pending") {
      return {
        data: null,
        error: {
          message:
            "Ce paiement a déjà été traité.",
        },
      };
    }

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

    const result =
      await PaymentRepository.rejectPayment(
        paymentId
      );

    if (result.error) {
      return result;
    }

    if (agentId) {
      await NotificationService.notify({
        agency_id: agentId,
        type: "subscription_rejected",
        message:
          "Votre demande d'abonnement a été refusée. Veuillez vérifier votre preuve de paiement ou contacter le support.",
      });
    }

    return {
      data: result.data,
      error: null,
    };
  }

  static async getPendingPayments() {
    return PaymentRepository.getPendingPayments();
  }

  static async getPayment(
    id: string
  ) {
    return PaymentRepository.getPayment(id);
  }
}