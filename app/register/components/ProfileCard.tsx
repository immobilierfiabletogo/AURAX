'use client'

import { ArrowRight, Check } from 'lucide-react'

interface ProfileCardProps {
  icon: React.ElementType
  title: string
  description: string
  advantages: string[]
  color: string
  background: string
  border: string
  buttonLabel: string
  onClick: () => void
}

export default function ProfileCard({
  icon: Icon,
  title,
  description,
  advantages,
  color,
  background,
  border,
  buttonLabel,
  onClick,
}: ProfileCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex h-full w-full flex-col rounded-[30px] border bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      style={{ borderColor: border }}
    >
      {/* Icône */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ background }}
      >
        <Icon
          className="h-8 w-8"
          style={{ color }}
        />
      </div>

      {/* Titre */}
      <h2 className="mt-8 text-2xl font-black text-slate-900">
        {title}
      </h2>

      {/* Description */}
      <p className="mt-3 text-sm leading-7 text-slate-500">
        {description}
      </p>

      {/* Séparateur */}
      <div className="my-8 h-px bg-slate-100" />

      {/* Avantages */}
      <div className="space-y-4">

        {advantages.map((item) => (

          <div
            key={item}
            className="flex items-center gap-3"
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background }}
            >
              <Check
                className="h-3.5 w-3.5"
                style={{ color }}
              />
            </div>

            <span className="text-sm font-medium text-slate-700">
              {item}
            </span>

          </div>

        ))}

      </div>

      {/* CTA */}
      <div className="mt-auto pt-10">

        <div
          className="flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-black text-white transition-all duration-300 group-hover:shadow-lg"
          style={{ backgroundColor: color }}
        >
          {buttonLabel}

          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

        </div>

      </div>
    </button>
  )
}