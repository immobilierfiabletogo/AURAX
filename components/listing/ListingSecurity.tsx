'use client'

import {
  ShieldCheck,
  BadgeCheck,
  CircleAlert,
  Flag,
} from 'lucide-react'

export default function ListingSecurity() {
  const tips = [
    "Visitez toujours le bien avant d'effectuer un paiement.",
    "Vérifiez l'identité du propriétaire ou de l'agence.",
    "Exigez un contrat ou un reçu avant toute transaction.",
    "Ne versez jamais d'acompte via Mobile Money sans garantie.",
  ]

  return (
    <section
      className="
        overflow-hidden
        rounded-[32px]
        border
        border-emerald-100
        bg-gradient-to-br
        from-white
        via-emerald-50/40
        to-white
        shadow-sm
      "
    >
      <div className="border-b border-emerald-100 p-8">

        <div className="flex items-start gap-5">

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-emerald-100
            "
          >
            <ShieldCheck
              className="
                h-8
                w-8
                text-emerald-600
              "
            />
          </div>

          <div className="space-y-2">

            <span
              className="
                inline-flex
                rounded-full
                bg-emerald-100
                px-3
                py-1
                text-xs
                font-black
                uppercase
                tracking-wider
                text-emerald-700
              "
            >
              Sécurité
            </span>

            <h2
              className="
                text-2xl
                font-black
                text-slate-900
              "
            >
              Achetez ou louez en toute sécurité
            </h2>

            <p
              className="
                max-w-2xl
                text-sm
                leading-7
                text-slate-600
              "
            >
              AURAX vous recommande de suivre ces bonnes pratiques afin
              d'éviter les fraudes et de réaliser votre transaction
              sereinement.
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-4 p-8">

        {tips.map((tip, index) => (

          <div
            key={index}
            className="
              flex
              items-start
              gap-4
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              transition
              duration-300
              hover:border-emerald-200
              hover:shadow-md
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-100
              "
            >
              <BadgeCheck
                className="
                  h-5
                  w-5
                  text-emerald-600
                "
              />
            </div>

            <p
              className="
                leading-7
                text-slate-700
              "
            >
              {tip}
            </p>

          </div>

        ))}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-amber-200
            bg-amber-50
            p-5
          "
        >

          <div className="flex gap-4">

            <CircleAlert
              className="
                mt-0.5
                h-6
                w-6
                shrink-0
                text-amber-600
              "
            />

            <div>

              <h3
                className="
                  font-black
                  text-amber-800
                "
              >
                Attention aux annonces frauduleuses
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-7
                  text-amber-700
                "
              >
                Si une offre paraît trop belle pour être vraie ou si un
                vendeur vous demande un paiement immédiat, interrompez la
                conversation et contactez notre équipe.
              </p>

            </div>

          </div>

        </div>

        <button
          type="button"
          className="
            mt-2
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-6
            py-4
            font-bold
            text-slate-700
            transition-all
            duration-300
            hover:border-rose-300
            hover:bg-rose-50
            hover:text-rose-600
          "
        >
          <Flag className="h-5 w-5" />
          Signaler cette annonce
        </button>

      </div>

    </section>
  )
}