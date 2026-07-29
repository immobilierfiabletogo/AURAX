'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'

import { createClient } from "@/lib/supabase/client";

const LOCAL_KEY = 'aurax_favorites'

interface FavoritesContextType {
  favorites: string[]
  loading: boolean
  isFavorite: (listingId: string) => boolean
  toggleFavorite: (listingId: string) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

interface Props {
  children: ReactNode
}

export function FavoritesProvider({ children }: Props) {
  const supabase = useMemo(() => createClient(), [])

  const [favorites, setFavorites] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function initialize() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!mounted) return

      if (!user) {
        const local = JSON.parse(
          localStorage.getItem(LOCAL_KEY) ?? '[]'
        ) as string[]

        setFavorites(local)
        setLoading(false)
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id)

      const dbFavorites: string[] = (data ?? [])
        .flatMap(row => (row.listing_id ? [row.listing_id] : []))
        
      const localFavorites = JSON.parse(
        localStorage.getItem(LOCAL_KEY) ?? '[]'
      ) as string[]

      const merged = Array.from(
        new Set([
          ...dbFavorites,
          ...localFavorites,
        ])
      )

      setFavorites(merged)

      if (localFavorites.length > 0) {
        const missing = localFavorites.filter(
          id => !dbFavorites.includes(id)
        )

        if (missing.length > 0) {
          await Promise.all(
            missing.map(listingId =>
              supabase
                .from('favorites')
                .upsert({
                  user_id: user.id,
                  listing_id: listingId,
                })
            )
          )
        }

        localStorage.removeItem(LOCAL_KEY)
      }

      setLoading(false)
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [supabase])

  const isFavorite = useCallback(
    (listingId: string) => favorites.includes(listingId),
    [favorites]
  )

    const toggleFavorite = useCallback(
    async (listingId: string) => {
      const isFav = favorites.includes(listingId)

      if (isFav) {
        const updated = favorites.filter(id => id !== listingId)
        setFavorites(updated)

        if (userId) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('listing_id', listingId)
        } else {
          localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify(updated)
          )
        }

        return
      }

      const updated = [...favorites, listingId]
      setFavorites(updated)

      if (userId) {
        await supabase
          .from('favorites')
          .upsert({
            user_id: userId,
            listing_id: listingId,
          })
      } else {
        localStorage.setItem(
          LOCAL_KEY,
          JSON.stringify(updated)
        )
      }
    },
    [favorites, userId, supabase]
  )

  const value = useMemo(
    () => ({
      favorites,
      loading,
      isFavorite,
      toggleFavorite,
    }),
    [
      favorites,
      loading,
      isFavorite,
      toggleFavorite,
    ]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error(
      'useFavorites doit être utilisé à l’intérieur du FavoritesProvider.'
    )
  }

  return context
}