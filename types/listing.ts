import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./database";

export type Listing = Tables<"listings">;

export type ListingInsert = TablesInsert<"listings">;

export type ListingUpdate = TablesUpdate<"listings">;

export type TransactionType =
  | ""
  | "vente"
  | "location";

export type PropertyType =
  | ""
  | "appartement"
  | "chambre"
  | "maison"
  | "terrain"
  | "bureau";

export type SortType =
  | "recent"
  | "price_asc"
  | "price_desc"
  | "views";

export type BudgetType =
  | ""
  | "petit"
  | "moyen"
  | "grand"
  | "luxe";

export interface CatalogueFilters {
  zone?: string;
  type?: PropertyType;
  transaction?: TransactionType;
  budget?: BudgetType;
  sort?: SortType;
  page?: number;
}