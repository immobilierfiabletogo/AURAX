'use client'

import {
  Building2,
  Image as ImageIcon,
  Zap,
} from 'lucide-react'

interface Props {
  images: string[]
  title: string
  activeImage: string
  setActiveImage: (image: string) => void
  isBoosted: boolean
  transactionType: string
  onOpenGallery: (index: number) => void
}

export default function ListingGallery({
  images,
  title,
  activeImage,
  setActiveImage,
  isBoosted,
  transactionType,
  onOpenGallery,
}: Props) {
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-5">

      <div
        className="
          relative
          aspect-[16/10]
          overflow-hidden
          rounded-[32px]
          border
          border-slate-200
          bg-slate-100
          shadow-xl
        "
      >

        {activeImage ? (
          <img
            src={activeImage}
            alt={title}
            onClick={() =>
              onOpenGallery(
                images.findIndex(
                  image => image === activeImage
                )
              )
            }
           className="
           h-full
           w-full
           object-cover
           cursor-zoom-in
           transition-transform
           duration-700
           hover:scale-105
           active:scale-100
           "
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2
              className="
                h-24
                w-24
                text-slate-300
              "
            />
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {/* Badge TOP */}
        {isBoosted && (
          <span
            className="
              absolute
              left-3
              top-3
              sm:left-4
              sm:top-4
              flex
              items-center
              gap-2
              rounded-full
              bg-amber-500
              px-2.5
              py-1.5
              sm:px-3
              sm:py-2
              text-[10px]
              sm:text-[11px]
              text-xs
              font-bold
              text-white
              shadow-xl
              backdrop-blur-md
            "
          >
            <Zap className="h-4 w-4 fill-white" />
            TOP
          </span>
        )}

        {/* Vente / Location */}
        <span
          className={`
            absolute
            right-3
            top-3
            sm:right-4
            sm:top-4
            rounded-full
            px-2.5
            py-1.5
            sm:px-3
            sm:py-2
            text-[10px]
            sm:text-[11px]
            font-bold
            uppercase
            shadow-xl
            backdrop-blur-md

            ${
              transactionType === 'location'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }
          `}
        >
          {transactionType === 'location'
            ? 'Location'
            : 'Vente'}
        </span>

        {/* Bouton Galerie */}
        {images.length > 1 && (
          <button
            onClick={() => onOpenGallery(0)}
            className="
              absolute
              bottom-3
              right-3
              sm:bottom-4
              sm:right-4
              flex
              items-center
              gap-2
              rounded-full
              bg-white/90
              px-2.5
              py-1.5
              sm:px-3
              sm:py-2
              text-[11px]
              sm:text-xs
              font-semibold
              text-slate-900
              shadow-xl
              backdrop-blur-md
              transition-all
              hover:bg-white
              hover:scale-105
            "
          >
            <ImageIcon className="h-4 w-4" />
            Voir les {images.length} photos
          </button>
        )}

      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div
          className="
            flex
            gap-2
            sm:gap-3
            overflow-x-auto
            pb-2
            snap-x
            snap-mandatory
            scroll-smooth
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(image)}
              className={`
                h-20
                w-28
                sm:h-24
                sm:w-32
                snap-start
                shrink-0
                overflow-hidden
                rounded-2xl
                border-2
                shadow-md
                transition-all
                duration-300

                ${
                  activeImage === image
                    ? 'scale-105 border-emerald-500 ring-2 sm:ring-4 ring-emerald-500/30 shadow-xl'
                    : 'border-slate-200 hover:scale-105 hover:border-slate-400 hover:shadow-xl'
                }
              `}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}