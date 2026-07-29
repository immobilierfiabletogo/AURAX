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

  const [listings, setListings] = useState<Listing[]>([])

  const [loading, setLoading] = useState(true)

  const [loadingMore, setLoadingMore] =
    useState(false)

  const [total, setTotal] = useState(0)

  const [hasMore, setHasMore] =
    useState(true)

  const [search, setSearch] = useState('')

  const fetchListings = useCallback(
    async (page: number) => {
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
            search
          )

        const rows =
          result.listings as Listing[]

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
    [search]
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
          rootMargin: '400px',
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
    search,
    setSearch,
    hasMore,
    observerRef,
  }
}