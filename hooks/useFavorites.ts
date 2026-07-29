'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '.././utils/supabase'

const LOCAL_KEY = 'aurax_favorites'


export function useFavorites() {

  const supabase = useMemo(
    () => createClient(),
    []
  )


  const [favorites, setFavorites] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)


  /**
   * Chargement initial favoris
   */
  useEffect(() => {

    const init = async () => {

      try {

        const {
          data: { user },
        } = await supabase.auth.getUser()


        const localFavs =
          JSON.parse(
            localStorage.getItem(LOCAL_KEY) ?? '[]'
          ) as string[]



        // Utilisateur connecté
        if (user) {

          setUserId(user.id)


          const {
            data,
            error,
          } = await supabase
            .from('favorites')
            .select('listing_id')
            .eq('user_id', user.id)



          if (error) {
            console.error(
              'Erreur chargement favoris:',
              error
            )
          }


          const dbFavs: string[] =
           (data ?? []).map(
             (fav: { listing_id: string }) => fav.listing_id
           )



          const merged =
            Array.from(
              new Set([
                ...dbFavs,
                ...localFavs,
              ])
            )


          setFavorites(merged)



          /**
           * Synchronisation localStorage → DB
           */
          const missing =
            localFavs.filter(
              id => !dbFavs.includes(id)
            )


          if (missing.length > 0) {

            await Promise.all(
              missing.map(
                listing_id =>
                  supabase
                    .from('favorites')
                    .upsert({
                      user_id: user.id,
                      listing_id,
                    })
              )
            )


            localStorage.removeItem(
              LOCAL_KEY
            )

          }


        } else {


          // Visiteur non connecté

          setFavorites(localFavs)

        }


      } catch (error) {

        console.error(
          'Erreur favoris:',
          error
        )

      } finally {

        setLoading(false)

      }

    }


    init()


  }, [supabase])



  /**
   * Vérifier si un bien est favori
   */
  const isFavorite = useCallback(
    (listingId:string) =>
      favorites.includes(listingId),
    [favorites]
  )



  /**
   * Ajouter / retirer favori
   */
  const toggleFavorite = useCallback(
    async (listingId:string) => {


      const exists =
        favorites.includes(listingId)



      // Mise à jour instantanée UI

      setFavorites(prev =>

        exists

          ? prev.filter(
              id => id !== listingId
            )

          : [
              ...prev,
              listingId,
            ]

      )



      try {


        if (userId) {


          if (exists) {

            await supabase
              .from('favorites')
              .delete()
              .eq(
                'user_id',
                userId
              )
              .eq(
                'listing_id',
                listingId
              )


          } else {


            await supabase
              .from('favorites')
              .upsert({
                user_id:userId,
                listing_id:listingId,
              })


          }


        } else {


          const updated =
            exists

              ? favorites.filter(
                  id => id !== listingId
                )

              : [
                  ...favorites,
                  listingId,
                ]



          localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify(updated)
          )

        }


      } catch(error) {


        console.error(
          'Erreur modification favori:',
          error
        )


        // rollback simple
        setFavorites(prev =>

          exists

            ? [
                ...prev,
                listingId,
              ]

            : prev.filter(
                id => id !== listingId
              )

        )

      }


    },
    [
      favorites,
      userId,
      supabase,
    ]
  )


  return {
    favorites,
    isFavorite,
    toggleFavorite,
    loading,
  }

}