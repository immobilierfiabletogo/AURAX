'use client'

import { useMemo, useState } from "react";
import {
  type LucideIcon,
  KeyRound,
  Banknote,
  Building2,
  House,
  Landmark,
  BedDouble,
  BriefcaseBusiness,
  MapPin,
  WalletCards,
} from "lucide-react";

import type {
  TransactionType,
  PropertyType,
  SortType,
  BudgetType,
} from "@/types/listing";

import SearchBar from "@/components/catalogue/SearchBar";
import FilterDrawer from "@/components/catalogue/FilterDrawer";
import ActiveFilters from "@/components/catalogue/ActiveFilters";

type FilterKey =
  | "transaction"
  | "type"
  | "budget"
  | "sort"
  | "zone";

interface Props {
  zoneInput: string;
  setZoneInput: (v: string) => void;

  transaction: TransactionType;
  type: PropertyType;
  budget: BudgetType;
  sort: SortType;

  total: number;
  hasActiveFilters: boolean;

  onSetParam: (
    key: FilterKey,
    value: string
  ) => void;

  onClearAll: () => void;
}

const TRANSACTION_OPTIONS = [
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

const TYPE_OPTIONS = [
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

const BUDGET_OPTIONS = [
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

const SORT_OPTIONS = [
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

export default function SearchFilters({
  zoneInput,
  setZoneInput,

  transaction,
  type,
  budget,
  sort,

  total,
  hasActiveFilters,

  onSetParam,
  onClearAll,
}: Props) {

  const [drawerOpen, setDrawerOpen] = useState(false);

  const removeFilter = (key: FilterKey) => {
    onSetParam(key, "");

    if (key === "zone") {
      setZoneInput("");
    }
  };

  const activeBadges = useMemo<
    {
      key: FilterKey;
      label: string;
      icon: LucideIcon;
    }[]
  >(() => {
    const badges: {
  key: FilterKey;
  label: string;
  icon: LucideIcon;
}[] = [];

    if (transaction) {
      badges.push({
        key: "transaction",
        label:
          transaction === "location"
            ? "Location"
            : "Vente",
        icon:
          transaction === "location"
            ? KeyRound
            : Banknote,
      });
    }

    if (type) {
      const current = TYPE_OPTIONS.find(
        item => item.val === type
      );

      if (current?.icon) {
        badges.push({
          key: "type",
          label: current.label,
          icon: current.icon,
        });
      }
    }

    if (budget) {
      const current = BUDGET_OPTIONS.find(
        item => item.val === budget
      );

      badges.push({
        key: "budget",
        label: current?.label ?? budget,
        icon: WalletCards,
      });
    }

    if (zoneInput) {
      badges.push({
        key: "zone",
        label: zoneInput,
        icon: MapPin,
      });
    }

    return badges;
  }, [
    transaction,
    type,
    budget,
    zoneInput,
  ]);

  return (
    <>      <SearchBar
        value={zoneInput}
        onChange={setZoneInput}
        onOpen={() => setDrawerOpen(true)}
      />

      <FilterDrawer
        zoneInput={zoneInput}
        setZoneInput={setZoneInput}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        transaction={transaction}
        type={type}
        budget={budget}
        sort={sort}
        onSetParam={onSetParam}
        transactionOptions={TRANSACTION_OPTIONS}
        typeOptions={TYPE_OPTIONS}
        budgetOptions={BUDGET_OPTIONS}
        sortOptions={SORT_OPTIONS}
      />

      <div
        className="
          sticky
          top-[112px]
          z-30
          bg-white
          border-b
          border-slate-100
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            py-4
          "
        >
          <ActiveFilters
            total={total}
            badges={activeBadges}
            hasActiveFilters={hasActiveFilters}
            onRemove={removeFilter}
            onClearAll={onClearAll}
          />
        </div>
      </div>
            </>
    );
}