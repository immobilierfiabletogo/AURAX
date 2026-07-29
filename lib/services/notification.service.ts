import { NotificationRepository } from "@/lib/repositories/notification.repository";

export class NotificationService {
  static async notify(data: {
    agency_id: string;
    type: string;
    message: string;
    listing_id?: string | null;
  }) {
    return NotificationRepository.create(data);
  }

  static async getNotifications(agencyId: string) {
    return NotificationRepository.findByUser(agencyId);
  }

  static async markAsRead(id: string) {
    return NotificationRepository.markAsRead(id);
  }

  static async markAllAsRead(agencyId: string) {
    return NotificationRepository.markAllAsRead(agencyId);
  }
}