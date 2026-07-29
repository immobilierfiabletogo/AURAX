import type {
  BudgetType,
  PropertyType,
  SortType,
  TransactionType,
} from "@/types/listing";

import {
  Banknote,
  BedDouble,
  BriefcaseBusiness,
  Building2,
  House,
  KeyRound,
  Landmark,
} from "lucide-react";

export const TRANSACTION_OPTIONS = [
  {
    val: "" as TransactionType,
    label: "Tout",
    icon: null,
  },
  {
    val: "location" as TransactionType,
    label: "Location",
    icon: KeyRound,
  },
  {
    val: "vente" as TransactionType,
    label: "Vente",
    icon: Banknote,
  },
];

export const TYPE_OPTIONS = [
  {
    val: "" as PropertyType,
    label: "Tous types",
    icon: null,
  },
  {
    val: "appartement" as PropertyType,
    label: "Appartement",
    icon: Building2,
  },
  {
    val: "chambre" as PropertyType,
    label: "Chambre",
    icon: BedDouble,
  },
  {
    val: "maison" as PropertyType,
    label: "Maison / Villa",
    icon: House,
  },
  {
    val: "terrain" as PropertyType,
    label: "Terrain",
    icon: Landmark,
  },
  {
    val: "bureau" as PropertyType,
    label: "Bureau",
    icon: BriefcaseBusiness,
  },
];

export const BUDGET_OPTIONS = [
  {
    val: "" as BudgetType,
    label: "Tous budgets",
  },
  {
    val: "petit" as BudgetType,
    label: "Petit budget",
  },
  {
    val: "moyen" as BudgetType,
    label: "Budget moyen",
  },
  {
    val: "grand" as BudgetType,
    label: "Grand budget",
  },
  {
    val: "luxe" as BudgetType,
    label: "Luxe",
  },
];

export const SORT_OPTIONS = [
  {
    val: "recent" as SortType,
    label: "Plus récents",
  },
  {
    val: "price_asc" as SortType,
    label: "Prix croissant",
  },
  {
    val: "price_desc" as SortType,
    label: "Prix décroissant",
  },
  {
    val: "views" as SortType,
    label: "Plus consultés",
  },
];