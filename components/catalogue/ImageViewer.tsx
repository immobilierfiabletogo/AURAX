'use client'

import { useEffect } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface Props {
  images: string[]
  current: number
  open: boolean
  onClose: () => void
  onChange: (index: number) => void
}

export default function ImageViewer({
  images,
  current,
  open,
  onClose,
  onChange,
}: Props) {

  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {

      if (e.key === 'Escape') {
        onClose()
      }

      if (e.key === 'ArrowLeft') {
        onChange(
          (current - 1 + images.length) %
            images.length
        )
      }

      if (e.key === 'ArrowRight') {
        onChange(
          (current + 1) %
            images.length
        )
      }
    }

    window.addEventListener(
      'keydown',
      handleKey
    )

    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener(
        'keydown',
        handleKey
      )

      document.body.style.overflow = ''
    }

  }, [
    open,
    current,
    images.length,
    onClose,
    onChange,
  ])

  if (!open || images.length === 0) {
    return null
  }

  const previous = () =>
    onChange(
      (current - 1 + images.length) %
        images.length
    )

  const next = () =>
    onChange(
      (current + 1) %
        images.length
    )

  return (

    <div
      className="
        fixed
        inset-0
        z-[999]
        bg-black/95
        flex
        items-center
        justify-center
      "
    >

      {/* Fermer */}

      <button
        onClick={onClose}
        className="
          absolute
          top-5
          right-5
          p-3
          rounded-full
          bg-white/10
          hover:bg-white/20
          text-white
          transition
        "
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image précédente */}

      {images.length > 1 && (

        <button
          onClick={previous}
          className="
            absolute
            left-5
            p-3
            rounded-full
            bg-white/10
            hover:bg-white/20
            text-white
            transition
          "
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

      )}

      {/* Image */}

      <img
        src={images[current]}
        alt=""
        className="
          max-w-[95vw]
          max-h-[90vh]
          object-contain
          rounded-xl
          select-none
        "
      />

      {/* Image suivante */}

      {images.length > 1 && (

        <button
          onClick={next}
          className="
            absolute
            right-5
            p-3
            rounded-full
            bg-white/10
            hover:bg-white/20
            text-white
            transition
          "
        >
          <ChevronRight className="w-8 h-8" />
        </button>

      )}

      {/* Compteur */}

      <div
        className="
          absolute
          bottom-6
          left-1/2
          -translate-x-1/2
          px-4
          py-2
          rounded-full
          bg-white/10
          backdrop-blur
          text-white
          text-sm
          font-bold
        "
      >
        {current + 1} / {images.length}
      </div>

    </div>

  )

}