'use client'

import { Grid, List } from 'lucide-react'
import { SearchInput, Button } from '@/components/ui'

interface Props {
  search: string
  onSearch: (value: string) => void

  filter: string
  onFilter: (value: any) => void

  counts: Record<string, number>

  view: 'liste' | 'grille'
  onView: (view: 'liste' | 'grille') => void
}

const FILTERS = [
  {
    value: 'tous',
    label: 'Toutes',
  },
  {
    value: 'actif',
    label: 'Actives',
  },
  {
    value: 'en_attente',
    label: 'Attente',
  },
  {
    value: 'expire',
    label: 'Expirées',
  },
]

export default function SearchToolbar({
  search,
  onSearch,
  filter,
  onFilter,
  counts,
  view,
  onView,
}: Props) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">

      <div className="w-full max-w-sm">
        <SearchInput
          value={search}
          onChange={onSearch}
        />
      </div>

      <div className="flex flex-wrap gap-2">

        {FILTERS.map((item) => (
          <Button
            key={item.value}
            variant={
              filter === item.value
                ? 'primary'
                : 'secondary'
            }
            onClick={() => onFilter(item.value)}
            className="h-11"
          >
            {item.label}

            <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-[11px]">
              {counts[item.value] ?? 0}
            </span>

          </Button>
        ))}

      </div>

      <div className="flex gap-2">

        <Button
          variant={
            view === 'liste'
              ? 'primary'
              : 'secondary'
          }
          onClick={() => onView('liste')}
        >
          <List size={17} />
        </Button>

        <Button
          variant={
            view === 'grille'
              ? 'primary'
              : 'secondary'
          }
          onClick={() => onView('grille')}
        >
          <Grid size={17} />
        </Button>

      </div>

    </div>
  )
}