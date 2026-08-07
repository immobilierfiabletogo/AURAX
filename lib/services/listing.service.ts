import { ListingRepository } from "@/lib/repositories/listing.repository";
import { SubscriptionService } from "@/lib/services/subscription.service";

export class ListingService {
  static async create(data: {
    title: string;
    description: string;
    price: number;
    property_type: string;
    transaction_type: string;
    zone_saisie: string;
    images_urls: string[];
    contact_phone: string | null;
    agent_id: string;
  }) {
    const quota = await SubscriptionService.canPublish(
      data.agent_id
    );

    if (!quota.allowed) {
      return {
        data: null,
        error: {
          message:
            quota.reason ??
            `Vous avez atteint la limite de votre abonnement (${quota.used}/${quota.limit} annonces).`,
        },
      };
    }

    const imagesQuota =
      await SubscriptionService.canUploadImages(
        data.agent_id,
        data.images_urls.length
      );

    if (!imagesQuota.allowed) {
      return {
        data: null,
        error: {
          message: imagesQuota.reason,
        },
      };
    }

    return ListingRepository.create({
      ...data,
      is_active: true,
    });
  }

  static async findAll() {
    return ListingRepository.findAll();
  }

  static async findById(id: string) {
    return ListingRepository.findById(id);
  }

  static async getCatalog(
    page: number,
    search: string
  ) {
    return ListingRepository.findCatalog(
      page,
      search
    );
  }

  static async findByAgent(agentId: string) {
    return ListingRepository.findByAgent(agentId);
  }

  static async update(
    id: string,
    data: Parameters<typeof ListingRepository.update>[1]
  ) {
    return ListingRepository.update(id, data);
  }

  static async delete(id: string) {
    return ListingRepository.delete(id);
  }

  static async incrementViews(id: string) {
    return ListingRepository.incrementViews(id);
  }

  static async incrementWhatsapp(id: string) {
    return ListingRepository.incrementWhatsapp(id);
  }

  static async boostListing(
    listingId: string,
    profileId: string
  ) {
    const quota =
      await SubscriptionService.canBoost(profileId);

    if (!quota.allowed) {
      return {
        data: null,
        error: {
          message:
            quota.reason ??
            "Vous avez atteint votre limite de boosts.",
        },
      };
    }

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + 3
    );

    const history =
      await ListingRepository.createBoost({
        listing_id: listingId,
        profile_id: profileId,
        expires_at:
          expiresAt.toISOString(),
      });

    if (history.error) {
      return history;
    }

    return ListingRepository.boostListing(
      listingId,
      expiresAt.toISOString()
    );
  }

  static async getListingDetails(id: string) {
    return this.getListingPage(id);
  }

  static async getListingPage(id: string) {
    await this.incrementViews(id);

    const { data: listing, error } =
      await this.findById(id);

    if (error || !listing) {
      return null;
    }

    const [
      { data: agency },
      { data: similar },
    ] = await Promise.all([
      ListingRepository.findAgent(
        listing.agent_id
      ),
      ListingRepository.findSimilar(
        listing.transaction_type,
        listing.property_type,
        listing.id
      ),
    ]);

    return {
      listing,
      agency,
      similarListings: similar ?? [],
      telephone:
        agency?.phone_number ??
        listing.contact_phone ??
        "+22879963708",
    };
  }
}