'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { AgencyClientService } from '@/lib/services/agency.client'

export interface Agency {
  id: string
  full_name: string
  avatar_url: string | null
  cover_url: string | null
  description: string | null
  adresse: string | null
  website: string | null
  phone_number: string | null
  plan: string | null
  verified: boolean
  created_at: string
  listings_count: number
}

export function useAgencies() {
  const observerRef =
    useRef<HTMLDivElement | null>(null)

  const pageRef = useRef(1)

  const loadingRef = useRef(false)

  const hasMoreRef = useRef(true)

  const [agencies, setAgencies] =
    useState<Agency[]>([])

  const [loading, setLoading] =
    useState(true)

  const [loadingMore, setLoadingMore] =
    useState(false)

  const [total, setTotal] =
    useState(0)

  const [hasMore, setHasMore] =
    useState(true)

  const [search, setSearch] =
    useState('')

  const fetchAgencies = useCallback(
    async (page: number) => {
      try {
        if (page === 1) {
          setLoading(true)
        } else {
          setLoadingMore(true)
          loadingRef.current = true
        }

        const result =
          await AgencyClientService.getCatalog(
            page,
            search
          )

        const rows: Agency[] = result.agencies.map(
          (agency: any) => ({
            ...agency,
            verified: agency.verified ?? false,
          })
        )

        if (page === 1) {
          setAgencies(rows)
        } else {
          setAgencies(previous => {
            const ids = new Set(
              previous.map(a => a.id)
            )

            return [
              ...previous,
              ...rows.filter(
                a => !ids.has(a.id)
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
    fetchAgencies(1)
  }, [fetchAgencies])

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            !entry ||
            !entry.isIntersecting ||
            loadingRef.current ||
            !hasMoreRef.current
          ) {
            return
          }

          pageRef.current++

          fetchAgencies(pageRef.current)
        },
        {
          threshold: 0.15,
          rootMargin: '400px',
        }
      )

    const current =
      observerRef.current

    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }

      observer.disconnect()
    }
  }, [fetchAgencies])

  return {
    agencies,
    loading,
    loadingMore,
    total,
    search,
    setSearch,
    hasMore,
    observerRef,
  }
}