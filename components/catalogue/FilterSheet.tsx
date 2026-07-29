'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface FilterSheetProps {
  open: boolean
  title?: string
  children: React.ReactNode
  onClose: () => void
}

export default function FilterSheet({
  open,
  title = 'Filtres',
  children,
  onClose,
}: FilterSheetProps) {
  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200]">

      {/* Overlay */}

      <button
        aria-label="Fermer"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/40
          backdrop-blur-sm
        "
      />

      {/* Sheet */}

      <aside
        className="
          absolute
          right-0
          top-0
          h-full
          w-full
          max-w-md
          overflow-y-auto
          bg-white
          shadow-2xl
          animate-in
          slide-in-from-right
          duration-300
        "
      >
        <header
          className="
            sticky
            top-0
            z-20
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-6
            py-5
          "
        >
          <h2 className="text-lg font-black text-slate-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-xl
              p-2
              transition
              hover:bg-slate-100
            "
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-6">
          {children}
        </div>

      </aside>

    </div>
  )
}