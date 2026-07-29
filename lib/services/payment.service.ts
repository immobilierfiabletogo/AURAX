import { PaymentRepository } from "@/lib/repositories/payment.repository";
import { NotificationService } from "@/lib/services/notification.service";

export class PaymentService {
  static async approve(
    paymentId: string,
    agentId: string,
    plan: "free" | "pro" | "premium",
    months: number
  ) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    const result = await PaymentRepository.approvePayment(
      paymentId,
      agentId,
      plan,
      expiresAt.toISOString()
    );

    if (!result.error) {
      await NotificationService.notify({
        agency_id: agentId,
        type: "subscription_approved",
        message: `Votre abonnement ${plan.toUpperCase()} a été activé pour ${months} mois.`,
      });
    }

    return result;
  }

  static async reject(
    paymentId: string,
    agentId?: string
  ) {
    const result =
      await PaymentRepository.rejectPayment(paymentId);

    if (!result.error && agentId) {
      await NotificationService.notify({
        agency_id: agentId,
        type: "subscription_rejected",
        message:
          "Votre demande d'abonnement a été refusée. Veuillez vérifier votre preuve de paiement ou contacter le support.",
      });
    }

    return result;
  }

  static async getPendingPayments() {
    return PaymentRepository.getPendingPayments();
  }

  static async getPayment(id: string) {
    return PaymentRepository.getPayment(id);
  }
}