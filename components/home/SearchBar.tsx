'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-700">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
            AURAX
          </p>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            L'immobilier commence ici.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Découvrez des biens sélectionnés par des agences et propriétaires
            partout au Togo, sur une plateforme pensée pour inspirer confiance.
          </p>

        </div>

        <div className="mx-auto mt-14 max-w-4xl">

          <div className="rounded-[28px] bg-white p-3 shadow-2xl">

            <div className="relative">

              <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Rechercher une ville, un quartier ou un type de bien..."
                className="
                  h-16
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  pl-16
                  pr-16
                  text-base
                  text-slate-900
                  outline-none
                  transition
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-100
                "
              />

              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    p-2
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  <X className="h-5 w-5" />
                </button>
              )}

            </div>

          </div>

        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">

          {[
            'Lomé',
            'Agoè',
            'Adidogomé',
            'Baguida',
            'Kara',
            'Villa',
            'Appartement',
            'Terrain',
          ].map((item) => (
            <button
              key={item}
              onClick={() => onChange(item)}
              className="
                rounded-full
                border
                border-white/10
                bg-white/5
                px-5
                py-2
                text-sm
                font-medium
                text-slate-200
                backdrop-blur
                transition
                hover:border-white/20
                hover:bg-white
                hover:text-slate-900
              "
            >
              {item}
            </button>
          ))}

        </div>

      </div>

    </section>
  )
}