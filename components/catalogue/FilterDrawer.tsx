'use client'

import type {
  BudgetType,
  PropertyType,
  SortType,
  TransactionType,
} from '@/types/listing'

import type { LucideIcon } from 'lucide-react'

import FilterSheet from './FilterSheet'
import FilterRow from './FilterRow'
import FilterButton from './FilterButton'

type FilterKey =
  | 'transaction'
  | 'type'
  | 'budget'
  | 'sort'
  | 'zone'

interface Option<T extends string> {
  val: T
  label: string
  icon?: LucideIcon | null
}

interface Props {
  open: boolean
  onClose: () => void

  zoneInput: string
  setZoneInput: (value: string) => void

  transaction: TransactionType
  type: PropertyType
  budget: BudgetType
  sort: SortType

  onSetParam: (
    key: FilterKey,
    value: string
  ) => void

  transactionOptions: Option<TransactionType>[]
  typeOptions: Option<PropertyType>[]
  budgetOptions: Option<BudgetType>[]
  sortOptions: Option<SortType>[]
}

export default function FilterDrawer({
  open,
  onClose,
  zoneInput,
  setZoneInput,
  transaction,
  type,
  budget,
  sort,
  onSetParam,
  transactionOptions,
  typeOptions,
  budgetOptions,
  sortOptions,
}: Props) {
  return (
    <FilterSheet
      open={open}
      onClose={onClose}
      title="Recherche"
    >
      <div className="space-y-8">
              <div>
          <label className="mb-2 block text-sm font-bold">
            Localisation
          </label>

          <input
            value={zoneInput}
            onChange={(e) => {
              setZoneInput(e.target.value)
              onSetParam('zone', e.target.value)
            }}
            placeholder="Ville ou quartier..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              outline-none
              transition
              focus:border-emerald-500
            "
          />
        </div>

        <FilterRow title="Transaction">
          {transactionOptions.map(({ val, label, icon: Icon }) => (
            <FilterButton
              key={val}
              active={transaction === val}
              onClick={() => onSetParam('transaction', val)}
            >
              {Icon && <Icon size={15} />}
              {label}
            </FilterButton>
          ))}
        </FilterRow>

        <FilterRow title="Type">
          {typeOptions.map(({ val, label, icon: Icon }) => (
            <FilterButton
              key={val}
              active={type === val}
              color="emerald"
              onClick={() => onSetParam('type', val)}
            >
              {Icon && <Icon size={15} />}
              {label}
            </FilterButton>
          ))}
        </FilterRow>

        <FilterRow title="Budget">
          {budgetOptions.map(({ val, label }) => (
            <FilterButton
              key={val}
              active={budget === val}
              color="blue"
              onClick={() => onSetParam('budget', val)}
            >
              {label}
            </FilterButton>
          ))}
        </FilterRow>
                <div>
          <label className="mb-2 block text-sm font-bold">
            Trier par
          </label>

          <select
            value={sort}
            onChange={(e) => onSetParam('sort', e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              outline-none
              focus:border-emerald-500
            "
          >
            {sortOptions.map(({ val, label }) => (
              <option
                key={val}
                value={val}
              >
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              border
              border-slate-200
              py-3
              font-semibold
              transition
              hover:bg-slate-50
            "
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              bg-emerald-600
              py-3
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
            "
          >
            Appliquer
          </button>
        </div>

      </div>
    </FilterSheet>
  )
}