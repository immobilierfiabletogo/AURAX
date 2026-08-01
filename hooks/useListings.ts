'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { ListingClientService } from '@/lib/services/listing.client'
import type { Listing } from '@/components/home/ListingCard'

export const ITEMS_PER_PAGE = 12

export function useListings() {
  const observerRef = useRef<HTMLDivElement | null>(null)

  const pageRef = useRef(1)

  const loadingRef = useRef(false)

  const hasMoreRef = useRef(true)

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cache = useRef<
    Record<
      string,
      {
        listings: Listing[]
        total: number
        hasMore: boolean
      }
    >
  >({})

  const [listings, setListings] = useState<Listing[]>([])

  const [loading, setLoading] = useState(true)

  const [loadingMore, setLoadingMore] =
    useState(false)

  const [total, setTotal] = useState(0)

  const [hasMore, setHasMore] =
    useState(true)

  const [search, setSearch] = useState('')

  const [query, setQuery] = useState('')

  // Préparation des futurs filtres
  const [transactionType, setTransactionType] =
    useState('')

  const [propertyType, setPropertyType] =
    useState('')

  const [priceMin, setPriceMin] =
    useState<number>()

  const [priceMax, setPriceMax] =
    useState<number>()

  // Debounce
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    searchTimeout.current = setTimeout(() => {
      setQuery(search)
    }, 350)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [search])

  const fetchListings = useCallback(
    async (page: number) => {
      const cacheKey = JSON.stringify({
        page,
        query,
        transactionType,
        propertyType,
        priceMin,
        priceMax,
      })

      if (cache.current[cacheKey]) {
        const data = cache.current[cacheKey]

        if (page === 1) {
          setListings(data.listings)
        } else {
          setListings(previous => [
            ...previous,
            ...data.listings.filter(
              item =>
                !previous.some(
                  p => p.id === item.id
                )
            ),
          ])
        }

        setTotal(data.total)
        setHasMore(data.hasMore)
        hasMoreRef.current = data.hasMore

        return
      }

      try {
        if (page === 1) {
          setLoading(true)
        } else {
          setLoadingMore(true)
          loadingRef.current = true
        }

        const result =
          await ListingClientService.getCatalog(
            page,
            query,
            {
              transactionType,
              propertyType,
              minPrice: priceMin,
              maxPrice: priceMax,
            }
          )

        const rows =
          result.listings as Listing[]

        cache.current[cacheKey] = {
          listings: rows,
          total: result.total,
          hasMore: result.hasMore,
        }

        if (page === 1) {
          setListings(rows)
        } else {
          setListings(previous => {
            const ids = new Set(
              previous.map(
                listing => listing.id
              )
            )

            return [
              ...previous,
              ...rows.filter(
                listing =>
                  !ids.has(listing.id)
              ),
            ]
          })
        }

        setTotal(result.total)

        setHasMore(result.hasMore)

        hasMoreRef.current =
          result.hasMore
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
        loadingRef.current = false
      }
    },
    [
      query,
      transactionType,
      propertyType,
      priceMin,
      priceMax,
    ]
  )

  useEffect(() => {
    pageRef.current = 1
    fetchListings(1)
  }, [fetchListings])

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (!entry) return

          if (
            !entry.isIntersecting ||
            loadingRef.current ||
            !hasMoreRef.current
          ) {
            return
          }

          pageRef.current++

          fetchListings(pageRef.current)
        },
        {
          threshold: 0.15,
          rootMargin: '900px',
        }
      )

    const current = observerRef.current

    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }

      observer.disconnect()
    }
  }, [fetchListings])

  return {
    listings,
    loading,
    loadingMore,
    total,
    hasMore,

    search,
    setSearch,

    transactionType,
    setTransactionType,

    propertyType,
    setPropertyType,

    priceMin,
    setPriceMin,

    priceMax,
    setPriceMax,

    observerRef,
  }
}