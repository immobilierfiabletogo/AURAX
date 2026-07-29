'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { fetchListings } from '@/lib/catalogue'
import type { Listing, CatalogueFilters, TransactionType, PropertyType,SortType, BudgetType,} from '@/types/listing'

const DEBOUNCE_MS = 400

export function useCatalogue() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const zone = (searchParams.get('zone') ?? '') as string

  const type = (searchParams.get('type') ?? '') as PropertyType

  const transaction = (searchParams.get('transaction') ?? '') as TransactionType

  const budget = (searchParams.get('budget') ?? '') as BudgetType

  const sort = (searchParams.get('sort') ?? 'recent') as SortType

  const page = Number(searchParams.get('page') ?? '1')

  const [listings, setListings] = useState<Listing[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [zoneInput, setZoneInput] = useState(zone)

  // Compatible navigateur + Node
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (filters: CatalogueFilters) => {
    setLoading(true)

    try {
      const result = await fetchListings(filters)

      setListings(result.data)
      setTotal(result.count)
      setTotalPages(result.totalPages)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load({
      zone,
      type,
      transaction,
      budget,
      sort,
      page,
    })
  }, [load, zone, type, transaction, budget, sort, page])

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value.trim()) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      params.delete('page')

      router.replace(`/biens?${params.toString()}`)
    },
    [router, searchParams]
  )

  // Debounce recherche
  useEffect(() => {
    if (zoneInput === zone) return

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      setParam('zone', zoneInput)
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [zoneInput, zone, setParam])

  const clearAll = useCallback(() => {
    router.push('/biens')
  }, [router])

  const hasActiveFilters =
    Boolean(zone) ||
    Boolean(type) ||
    Boolean(transaction) ||
    Boolean(budget) ||
    sort !== 'recent'

  return {
    // Données
    listings,
    total,
    totalPages,
    loading,
    page,

    // Filtres
    zone,
    type,
    transaction,
    budget,
    sort,
    hasActiveFilters,

    // Recherche
    zoneInput,
    setZoneInput,

    // Actions
    setParam,
    clearAll,
  }
}