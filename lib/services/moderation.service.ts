import { ModerationRepository } from "@/lib/repositories/moderation.repository";
import { NotificationService } from "@/lib/services/notification.service";

export class ModerationService {
  static async approveAgency(
    agencyId: string,
    adminId: string
  ) {
    const result = await ModerationRepository.approveAgency(
      agencyId,
      adminId
    );

    if (!result.error) {
      await NotificationService.notify({
        agency_id: agencyId,
        type: "agency_verified",
        message:
          "Votre agence a été vérifiée par AURAX. Vous pouvez désormais accéder à la page d'abonnement afin d'activer votre compte.",
      });
    }

    return result;
  }

  static async rejectAgency(
    agencyId: string
  ) {
    const result =
      await ModerationRepository.rejectAgency(
        agencyId
      );

    if (!result.error) {
      await NotificationService.notify({
        agency_id: agencyId,
        type: "agency_rejected",
        message:
          "Votre demande d'inscription a été refusée. Contactez AURAX si vous pensez qu'il s'agit d'une erreur.",
      });
    }

    return result;
  }

  static async getPendingAgencies() {
    return ModerationRepository.getPendingAgencies();
  }

  static async getAgency(
    agencyId: string
  ) {
    return ModerationRepository.getAgency(
      agencyId
    );
  }
}