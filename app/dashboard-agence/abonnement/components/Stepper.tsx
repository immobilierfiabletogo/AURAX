'use client'

import { CheckCircle2 } from 'lucide-react'

type Step = 'plans' | 'checkout' | 'confirm'

interface StepperProps {
  step: Step
}

const STEPS = [
  {
    id: 'plans',
    label: 'Choix du plan',
  },
  {
    id: 'checkout',
    label: 'Paiement',
  },
  {
    id: 'confirm',
    label: 'Confirmation',
  },
]

export default function Stepper({
  step,
}: StepperProps) {
  const currentIndex = STEPS.findIndex(
    (s) => s.id === step
  )

  return (
    <div className="mb-10">

      <div className="flex items-center justify-between">

        {STEPS.map((item, index) => {
          const active = index <= currentIndex

          return (
            <div
              key={item.id}
              className="flex flex-1 items-center"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all ${
                    active
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {active ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-black">
                      {index + 1}
                    </span>
                  )}
                </div>

                <span
                  className={`mt-3 text-xs font-bold ${
                    active
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>

              </div>

              {index < STEPS.length - 1 && (
                <div className="mx-3 h-[2px] flex-1 bg-slate-200">

                  <div
                    className={`h-full transition-all ${
                      index < currentIndex
                        ? 'bg-emerald-600'
                        : 'bg-transparent'
                    }`}
                  />

                </div>
              )}

            </div>
          )
        })}

      </div>

    </div>
  )
}