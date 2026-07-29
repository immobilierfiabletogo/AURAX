'use client'

import { useCallback, useState } from 'react'

import { createClient } from "@/lib/supabase/client";
import type { Listing } from '@/types'

const supabase = createClient()

const ITEMS_PER_PAGE = 50

export function useAdminListings(
  showToast: (text: string, type?: 'success' | 'error') => void
) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)

  const loadListings = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', {
        ascending: false,
      })
      .range(0, ITEMS_PER_PAGE - 1)

    setLoading(false)

    if (error) {
      showToast(
        'Impossible de charger les annonces',
        'error'
      )
      return
    }

    setListings(data ?? [])
  }, [showToast])

  const toggleActive = useCallback(
    async (id: string, current: boolean) => {
      const { error } = await supabase
        .from('listings')
        .update({
          is_active: !current,
        })
        .eq('id', id)

      if (error) {
        showToast(
          'Erreur lors du changement de statut',
          'error'
        )
        return
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                is_active: !current,
              }
            : listing
        )
      )

      showToast(
        !current
          ? 'Annonce activée'
          : 'Annonce désactivée'
      )
    },
    [showToast]
  )

  const toggleBoost = useCallback(
    async (id: string, current: boolean) => {
      const { error } = await supabase
        .from('listings')
        .update({
          is_boosted: !current,
        })
        .eq('id', id)

      if (error) {
        showToast(
          'Erreur lors du boost',
          'error'
        )
        return
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                is_boosted: !current,
              }
            : listing
        )
      )

      showToast(
        current
          ? 'Boost retiré'
          : 'Annonce boostée 🎉'
      )
    },
    [showToast]
  )

  const deleteListing = useCallback(
    async (id: string) => {
      if (
        !window.confirm(
          'Supprimer définitivement cette annonce ?'
        )
      ) {
        return
      }

      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

      if (error) {
        showToast(
          'Erreur lors de la suppression',
          'error'
        )
        return
      }

      setListings((prev) =>
        prev.filter(
          (listing) => listing.id !== id
        )
      )

      showToast('Annonce supprimée')
    },
    [showToast]
  )

  return {
    listings,
    setListings,
    loading,

    loadListings,

    toggleActive,
    toggleBoost,
    deleteListing,
  }
}