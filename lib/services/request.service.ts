import { RequestRepository } from "@/lib/repositories/request.repository";
import { Database } from "@/types/database";

type RequestInsert =
  Database["public"]["Tables"]["requests"]["Insert"];

type RequestUpdate =
  Database["public"]["Tables"]["requests"]["Update"];

export class RequestService {
  static async findAll(search = "", type = "") {
    return RequestRepository.findAll(search, type);
  }

  static async findById(id: string) {
    return RequestRepository.findById(id);
  }

  static async create(data: RequestInsert) {
    return RequestRepository.create(data);
  }

  static async update(
    id: string,
    data: RequestUpdate
  ) {
    return RequestRepository.update(id, data);
  }

  static async delete(id: string) {
    return RequestRepository.delete(id);
  }
}