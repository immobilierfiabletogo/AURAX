'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

import { createClient } from "@/lib/supabase/client";
import { useFavorites } from '@/contexts/FavoritesContext'

import PropertyCard from '@/components/catalogue/PropertyCard'

import type { Listing } from '@/types/listing'


export default function FavorisPage() {

  const supabase = createClient()

  const {
    favorites,
    loading: favLoading,
  } = useFavorites()


  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {

    if (favLoading) return


    async function loadFavorites() {

      if (favorites.length === 0) {

        setListings([])
        setLoading(false)

        return

      }


      const {
        data,
      } = await supabase
        .from('listings')
        .select(
          `
          id,
          title,
          price,
          zone_saisie,
          property_type,
          transaction_type,
          images_urls,
          is_boosted,
          created_at,
          views
          `
        )
        .in('id', favorites)
        .eq('is_active', true)



      const ordered = ((data ?? []) as Listing[]).sort(
        (a, b) =>
          favorites.indexOf(a.id) -
          favorites.indexOf(b.id)
      )

      setListings(ordered)

      setLoading(false)

    }


    loadFavorites()


  }, [
    favorites,
    favLoading,
    supabase,
  ])




  return (

    <div
      className="
        min-h-screen
        bg-[#f7f7f5]
        text-slate-900
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          py-8
        "
      >



        {/* Header */}

        <div
          className="
            flex
            items-center
            gap-3
            mb-8
          "
        >

          <div
            className="
              w-10
              h-10
              bg-rose-50
              rounded-xl
              flex
              items-center
              justify-center
            "
          >

            <Heart
              className="
                w-5
                h-5
                text-rose-500
                fill-rose-500
              "
            />

          </div>



          <div>

            <h1
              className="
                text-xl
                font-black
                text-slate-900
              "
            >
              Mes favoris
            </h1>


            <p
              className="
                text-xs
                text-slate-400
                font-medium
              "
            >

              {favorites.length}

              {' '}

              bien
              {favorites.length > 1 ? 's' : ''}

              {' '}
              sauvegardé
              {favorites.length > 1 ? 's' : ''}

            </p>


          </div>


        </div>





        {
          loading || favLoading ? (

            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >

              {
                Array.from({
                  length: 4
                }).map((_, i) => (

                  <div
                    key={i}
                    className="
                      animate-pulse
                      bg-white
                      rounded-2xl
                      overflow-hidden
                      border
                      border-slate-100
                    "
                  >

                    <div
                      className="
                        bg-slate-200
                        aspect-[4/3]
                      "
                    />

                    <div
                      className="
                        p-4
                        space-y-2
                      "
                    >

                      <div className="
                        h-3
                        bg-slate-200
                        rounded
                        w-1/3
                      "/>

                      <div className="
                        h-4
                        bg-slate-200
                        rounded
                        w-2/3
                      "/>

                    </div>

                  </div>

                ))
              }

            </div>


          ) : listings.length === 0 ? (


            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                py-24
                text-center
              "
            >

              <div
                className="
                  w-16
                  h-16
                  bg-rose-50
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >

                <Heart
                  className="
                    w-8
                    h-8
                    text-rose-300
                  "
                />

              </div>


              <h3
                className="
                  text-base
                  font-bold
                  text-slate-700
                "
              >
                Aucun favori
              </h3>


              <p
                className="
                  text-sm
                  text-slate-400
                  max-w-xs
                  mb-4
                "
              >
                Sauvegardez vos biens préférés pour les retrouver ici.
              </p>


              <Link
                href="/biens"
                className="
                  px-5
                  py-2.5
                  bg-slate-900
                  text-white
                  text-sm
                  font-bold
                  rounded-xl
                "
              >
                Voir les biens
              </Link>


            </div>


          ) : (


            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >

              {
                listings.map(l => (

                  <PropertyCard
                    key={l.id}
                    listing={l}
                  />

                ))
              }

            </div>


          )
        }


      </div>

    </div>

  )
}