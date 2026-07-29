'use client'

import type { ReactNode } from 'react'
import {
  KeyRound,
  Banknote,
  Building2,
  House,
  Landmark,
  BedDouble,
  BriefcaseBusiness,
  WalletCards,
  MapPin,
  ArrowUpDown,
  Search,
  X,
} from 'lucide-react'

import type {
  TransactionType,
  PropertyType,
  BudgetType,
  SortType,
} from '@/types/listing'

type FilterKey =
  | 'transaction'
  | 'type'
  | 'budget'
  | 'sort'
  | 'zone'

interface Props {
  zoneInput: string
  setZoneInput: (v: string) => void

  transaction: TransactionType
  type: PropertyType
  budget: BudgetType
  sort: SortType

  total: number
  hasActiveFilters: boolean

  onSetParam: (
    key: FilterKey,
    value: string
  ) => void

  onClearAll: () => void

  onClose: () => void
}

const TRANSACTION_OPTIONS = [
  {
    val: '' as TransactionType,
    label: 'Tout',
    icon: null,
  },
  {
    val: 'location' as TransactionType,
    label: 'Location',
    icon: KeyRound,
  },
  {
    val: 'vente' as TransactionType,
    label: 'Vente',
    icon: Banknote,
  },
]

const TYPE_OPTIONS = [
  {
    val: '' as PropertyType,
    label: 'Tous types',
    icon: null,
  },
  {
    val: 'appartement' as PropertyType,
    label: 'Appartement',
    icon: Building2,
  },
  {
    val: 'chambre' as PropertyType,
    label: 'Chambre',
    icon: BedDouble,
  },
  {
    val: 'maison' as PropertyType,
    label: 'Maison / Villa',
    icon: House,
  },
  {
    val: 'terrain' as PropertyType,
    label: 'Terrain',
    icon: Landmark,
  },
  {
    val: 'bureau' as PropertyType,
    label: 'Bureau',
    icon: BriefcaseBusiness,
  },
]

const BUDGET_OPTIONS = [
  {
    val: '' as BudgetType,
    label: 'Tous budgets',
  },
  {
    val: 'petit' as BudgetType,
    label: 'Petit budget',
  },
  {
    val: 'moyen' as BudgetType,
    label: 'Budget moyen',
  },
  {
    val: 'grand' as BudgetType,
    label: 'Grand budget',
  },
  {
    val: 'luxe' as BudgetType,
    label: 'Luxe',
  },
]

const SORT_OPTIONS = [
  {
    val: 'recent' as SortType,
    label: 'Plus récents',
  },
  {
    val: 'price_asc' as SortType,
    label: 'Prix croissant',
  },
  {
    val: 'price_desc' as SortType,
    label: 'Prix décroissant',
  },
  {
    val: 'views' as SortType,
    label: 'Plus consultés',
  },
]

export default function SearchFiltersContent(props: Props) {

  const {
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
    onClose,
  } = props

    return (
    <div className="space-y-8">

      {/* Recherche */}

      <div className="space-y-2">

        <label className="text-xs font-black uppercase tracking-wider text-slate-400">
          Recherche
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">

          <Search className="w-5 h-5 text-slate-400" />

          <input
            value={zoneInput}
            onChange={(e) => setZoneInput(e.target.value)}
            placeholder="Ville, quartier..."
            className="flex-1 bg-transparent outline-none text-sm font-medium"
          />

          {zoneInput && (
            <button
              type="button"
              onClick={() => setZoneInput('')}
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}

        </div>

      </div>

      {/* Transaction */}

      <div className="space-y-3">

        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Transaction
        </h3>

        <div className="flex flex-wrap gap-2">

          {TRANSACTION_OPTIONS.map(({ val, label, icon: Icon }) => (

            <FilterButton
              key={val}
              active={transaction === val}
              onClick={() => onSetParam('transaction', val)}
            >

              {Icon && <Icon className="w-4 h-4" />}

              {label}

            </FilterButton>

          ))}

        </div>

      </div>

      {/* Type */}

      <div className="space-y-3">

        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Type de bien
        </h3>

        <div className="flex flex-wrap gap-2">

          {TYPE_OPTIONS.map(({ val, label, icon: Icon }) => (

            <FilterButton
              key={val}
              active={type === val}
              color="emerald"
              onClick={() => onSetParam('type', val)}
            >

              {Icon && <Icon className="w-4 h-4" />}

              {label}

            </FilterButton>

          ))}

        </div>

      </div>

      {/* Budget */}

      <div className="space-y-3">

        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Budget
        </h3>

        <div className="flex flex-wrap gap-2">

          {BUDGET_OPTIONS.map(({ val, label }) => (

            <FilterButton
              key={val}
              active={budget === val}
              color="blue"
              onClick={() => onSetParam('budget', val)}
            >

              <WalletCards className="w-4 h-4" />

              {label}

            </FilterButton>

          ))}

        </div>

      </div>

      {/* Tri */}

      <div className="space-y-2">

        <label className="text-xs font-black uppercase tracking-wider text-slate-400">
          Trier par
        </label>

        <div className="relative">

          <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <select
            value={sort}
            onChange={(e) => onSetParam('sort', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 font-semibold outline-none"
          >

            {SORT_OPTIONS.map((option) => (

              <option
                key={option.val}
                value={option.val}
              >
                {option.label}
              </option>

            ))}

          </select>

        </div>

      </div>

            {/* Pied du panneau */}

      <div className="sticky bottom-0 bg-white pt-6 border-t border-slate-200">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={onClearAll}
            className="
              flex-1
              rounded-2xl
              border
              border-slate-200
              py-3
              font-bold
              text-slate-700
              transition
              hover:bg-slate-100
            "
          >
            Réinitialiser
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-2xl
              bg-slate-900
              py-3
              font-bold
              text-white
              transition
              hover:bg-slate-800
            "
          >
            Voir {total} bien{total > 1 ? 's' : ''}
          </button>

        </div>

        {hasActiveFilters && (
          <p className="mt-3 text-center text-xs text-slate-500">
            Les filtres sont appliqués automatiquement.
          </p>
        )}

      </div>

    </div>
  )
}

type FilterButtonProps = {
  active: boolean
  children: ReactNode
  onClick: () => void
  color?: 'dark' | 'emerald' | 'blue'
}

function FilterButton({
  active,
  children,
  onClick,
  color = 'dark',
}: FilterButtonProps) {

  const activeClass = {
    dark: 'bg-slate-900 text-white border-slate-900',
    emerald: 'bg-emerald-600 text-white border-emerald-600',
    blue: 'bg-blue-600 text-white border-blue-600',
  }[color]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        gap-2
        rounded-full
        border
        px-4
        py-2
        text-sm
        font-semibold
        transition

        ${
          active
            ? activeClass
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
        }
      `}
    >
      {children}
    </button>
  )
}