import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/constants/storage";

export class StorageService {
  static getPublicUrl(path: string) {
    const supabase = createClient();

    return supabase.storage
      .from(STORAGE_BUCKETS.LISTINGS)
      .getPublicUrl(path).data.publicUrl;
  }

  static async upload(
    path: string,
    file: File
  ) {
    const supabase = createClient();

    return supabase.storage
      .from(STORAGE_BUCKETS.LISTINGS)
      .upload(path, file);
  }

  static async remove(paths: string[]) {
    const supabase = createClient();

    return supabase.storage
      .from(STORAGE_BUCKETS.LISTINGS)
      .remove(paths);
  }
}