"use server";

import { ListingService } from "@/lib/services/listing.service";

export async function createListingAction(data: {
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
  return await ListingService.create(data);
}