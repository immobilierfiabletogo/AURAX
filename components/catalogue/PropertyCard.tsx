'use client'

import Link from 'next/link'
import {
  MapPin,
  Zap,
  Home,
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Heart
} from 'lucide-react'

import type { Listing } from '@/types/listing'
import { useFavorites } from '@/contexts/FavoritesContext'


function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-TG', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(prix)
}


function formatDate(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) /
    (1000 * 60 * 60 * 24)
  )

  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  if (diff < 7) return `Il y a ${diff} jours`

  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}



export default function PropertyCard({
  listing: l
}: {
  listing: Listing
}) {

  const {
    isFavorite,
    toggleFavorite
  } = useFavorites()


  const fav = isFavorite(l.id)


  return (

    <article
  className={`
    group
    relative
    flex
    flex-col
    overflow-hidden
    rounded-3xl
    bg-white
    border
    shadow-sm
    transition-all
    duration-500
    hover:-translate-y-2
    hover:shadow-2xl

    ${
      l.is_boosted
        ? 'border-amber-300 shadow-amber-100/60'
        : 'border-slate-200 hover:border-slate-300'
    }
  `}
>

      {/* IMAGE */}

      <Link
        href={`/biens/${l.id}`}
        className="
          relative
          block
          overflow-hidden
          bg-slate-100
        "
        style={{
          aspectRatio: '16/11'
        }}
      >

        {
          l.images_urls?.length > 0 ? (

            <>

              <img
                src={l.images_urls[0]}
                alt={l.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
                loading="lazy"
              />


              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-black/20
                  to-transparent
                  via-transparent
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                "
              />


              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  translate-y-5
                  opacity-0
                  transition-all
                  duration-500
                  group-hover:translate-y-0
                  group-hover:opacity-100
                  transition-opacity
                "
              >

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    bg-white/95
                    text-slate-900
                    text-xs
                    font-black
                    shadow-lg
                  "
                >

                  Voir le bien

                  <ArrowRight
                    className="w-4 h-4"
                  />

                </span>

              </div>

            </>


          ) : (

            <div
              className="
                w-full
                h-full
                flex
                items-center
                justify-center
              "
            >

              <Home
                className="
                  w-12
                  h-12
                  text-slate-300
                "
              />

            </div>

          )
        }



        {/* BADGE BOOST */}

        {
          l.is_boosted && (

            <span
              className="
                absolute
                top-2.5
                left-2.5
                inline-flex
                items-center
                gap-1
                px-3
                py-1.5
                rounded-lg
                bg-amber-500
                text-white
                text-[10px]
                font-black
              "
            >

              <Zap
                className="
                  w-3
                  h-3
                  fill-white
                "
              />

              TOP

            </span>

          )
        }



        {/* TYPE TRANSACTION */}

        <span
          className={`
            absolute
            top-2.5
            right-2.5
            px-3
            py-1.5
            rounded-lg
            text-[10px]
            font-black
            uppercase

            ${
              l.transaction_type === 'location'
              ? 'bg-emerald-500 text-white'
              : 'bg-blue-500 text-white'
            }
          `}
        >

          {
            l.transaction_type === 'location'
            ? 'Location'
            : 'Vente'
          }

        </span>

         {/* Bouton favori */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavorite(l.id)
        }}
        className={`absolute bottom-2.5 left-2.5 z-20 p-2 rounded-xl backdrop-blur-sm transition-all cursor-pointer ${
          fav
            ? 'bg-rose-500 text-white shadow-lg scale-110'
            : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white hover:scale-110 active:scale-95 duration-300'
        }`}
      >
        <Heart
          className={`w-4 h-4 ${
            fav ? 'fill-white' : ''
          }`}
        />
      </button>


        {/* PHOTOS */}

        {
          l.images_urls?.length > 1 && (

            <span
              className="
                absolute
                bottom-2.5
                right-2.5
                flex
                items-center
                gap-1
                px-3
                py-1.5
                rounded-lg
                bg-black/60
                text-white
                text-[10px]
                font-bold
              "
            >

              <ImageIcon
                className="w-3 h-3"
              />

              {l.images_urls.length}

            </span>

          )
        }


      </Link>
      





      {/* INFORMATIONS */}

      <div
        className="
          flex
          flex-col
          flex-1
          p-5
          space-y-3
        "
      >


        <div
          className="
            flex
            justify-between
            items-center
            mb-2
          "
        >

          <span
            className="
              text-[11px]
              tracking-wider
              font-black
              uppercase
              text-slate-400
            "
          >

            {l.property_type}

          </span>


          {
            l.created_at && (

              <span
                className="
                  text-[10px]
                  text-slate-300
                "
              >

                {formatDate(l.created_at)}

              </span>

            )
          }


        </div>




        <Link
          href={`/biens/${l.id}`}
        >

          <h3
            className="
             text-[16px]
             font-extrabold
             leading-6
             line-clamp-2
             transition-colors
             group-hover:text-emerald-600
            "
          >

            {l.title}

          </h3>

        </Link>




        {
          l.views !== undefined &&
          (l.views ?? 0) > 0 && (

            <div
              className="
                flex
                items-center
                gap-1
                mb-2
              "
            >

              <Eye
                className="
                  w-3
                  h-3
                  text-slate-300
                "
              />

              <span
                className="
                  text-[10px]
                  text-slate-300
                "
              >

                {l.views} vues

              </span>

            </div>

          )
        }




        <div
          className="
            mt-auto
            pt-3
            border-t
            border-slate-50
            flex
            justify-between
            items-center
          "
        >

          <span
            className="
              text-2xl
              font-extrabold
              tracking-tight
              text-slate-900
            "
          >

            {formatPrix(l.price)}

          </span>



          <span
            className="
              flex
              items-center
              gap-1
              text-[11px]
              text-slate-500
              max-w-[120px]
              truncate
            "
          >

            <MapPin
              className="
                w-3
                h-3
              "
            />

            {l.zone_saisie}

          </span>


        </div>


      </div>


    </article>

  )
}