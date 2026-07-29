'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface Props {
  images: string[]
  currentIndex: number
  open: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function ImageLightbox({
  images,
  currentIndex,
  open,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const touchStart = useRef<number | null>(null)

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!open) return

    setLoaded(false)

    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break

        case 'ArrowLeft':
          onPrev()
          break

        case 'ArrowRight':
          onNext()
          break
      }
    }

    window.addEventListener(
      'keydown',
      handleKey
    )

    return () => {
      document.body.style.overflow = ''

      window.removeEventListener(
        'keydown',
        handleKey
      )
    }
  }, [
    open,
    onClose,
    onPrev,
    onNext,
  ])

  if (!open || images.length === 0) {
    return null
  }

  const currentImage = images[currentIndex]

  function handleTouchStart(
    e: React.TouchEvent
  ) {
    touchStart.current =
      e.touches[0].clientX
  }

  function handleTouchEnd(
    e: React.TouchEvent
  ) {
    if (touchStart.current === null)
      return

    const diff =
      touchStart.current -
      e.changedTouches[0].clientX

    if (Math.abs(diff) > 70) {
      if (diff > 0) {
        onNext()
      } else {
        onPrev()
      }
    }

    touchStart.current = null
  }

  function disableContextMenu(
    e: React.MouseEvent
  ) {
    e.preventDefault()
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        bg-black/95
        backdrop-blur-xl
        select-none
      "
      onContextMenu={disableContextMenu}
    >
      {/* Barre supérieure */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-30
          flex
          items-center
          justify-between
          border-b
          border-white/10
          bg-black/20
          px-6
          py-5
          backdrop-blur-xl
        "
      >
        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-white/60
            "
          >
            Galerie
          </p>

          <h3
            className="
              mt-1
              text-lg
              font-black
              text-white
            "
          >
            {currentIndex + 1} / {images.length}
          </h3>

        </div>

        <button
          onClick={onClose}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-white/10
            text-white
            transition-all
            duration-300
            hover:rotate-90
            hover:bg-white/20
          "
        >
          <X className="h-6 w-6" />
        </button>

      </div>

      {/* Navigation */}

            {/* Image principale */}

      <div
        className="
          relative
          flex
          h-full
          items-center
          justify-center
          px-4
          py-20
          lg:px-16
        "
      >
        <img
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          draggable={false}
          className="
            max-h-full
            max-w-full
            rounded-3xl
            object-contain
            shadow-2xl
            select-none
          "
        />
      </div>

      {/* Footer */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          border-t
          border-white/10
          bg-black/60
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            py-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-sm
                font-semibold
                text-white/80
              "
            >
              {currentIndex + 1} sur {images.length}
            </span>

            <span
              className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-white/40
              "
            >
              AURAX
            </span>
          </div>

          {images.length > 1 && (
            <div
              className="
                mt-5
                flex
                gap-3
                overflow-x-auto
                pb-2
              "
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index > currentIndex) {
                      while (currentIndex < index) {
                        onNext()
                        currentIndex++
                      }
                    } else if (index < currentIndex) {
                      while (currentIndex > index) {
                        onPrev()
                        currentIndex--
                      }
                    }
                  }}
                  className={`
                    relative
                    h-20
                    w-28
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    border-2
                    transition-all
                    duration-300

                    ${
                      index === currentIndex
                        ? 'border-white shadow-xl'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }
                  `}
                >
                  <img
                    src={image}
                    alt=""
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
      </div>
    </div>
  )
}