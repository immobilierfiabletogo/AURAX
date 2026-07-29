'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../../utils/supabase'

const LOCAL_KEY = 'aurax_favorites'

export function useFavorites() {
  const supabase = createClient()
  const [favorites, setFavorites] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        // Charger depuis DB
        const { data } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id)
       const dbFavs = (data ?? []).map(
         (f: { listing_id: string }) => f.listing_id
       )
        // Fusionner avec localStorage
        const localFavs = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as string[]
        const merged = Array.from(new Set([...dbFavs, ...localFavs]))

        // Synchro localStorage → DB
        if (localFavs.length > 0) {
          await Promise.all(
            localFavs
              .filter(id => !dbFavs.includes(id))
              .map(listing_id =>
                supabase.from('favorites').upsert({ user_id: user.id, listing_id })
              )
          )
          localStorage.removeItem(LOCAL_KEY)
        }

        setFavorites(merged)
      } else {
        // Non connecté → localStorage
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as string[]
        setFavorites(local)
      }
      setLoading(false)
    }
    init()
  }, [])

  const isFavorite = (listingId: string) => favorites.includes(listingId)

  const toggleFavorite = useCallback(async (listingId: string) => {
    const isCurrentlyFav = favorites.includes(listingId)

    if (isCurrentlyFav) {
      setFavorites(prev => prev.filter(id => id !== listingId))
      if (userId) {
        await supabase.from('favorites').delete()
          .eq('user_id', userId).eq('listing_id', listingId)
      } else {
        const local = favorites.filter(id => id !== listingId)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(local))
      }
    } else {
      setFavorites(prev => [...prev, listingId])
      if (userId) {
        await supabase.from('favorites').upsert({ user_id: userId, listing_id: listingId })
      } else {
        const local = [...favorites, listingId]
        localStorage.setItem(LOCAL_KEY, JSON.stringify(local))
      }
    }
  }, [favorites, userId])

  return { favorites, isFavorite, toggleFavorite, loading }
}