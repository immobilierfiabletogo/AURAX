'use client'

import {
  ShieldCheck,
  Clock3,
  MessageCircle,
  Sparkles,
} from 'lucide-react'

const advantages = [
  {
    icon: ShieldCheck,
    title: 'Agence vérifiée',
    description:
      'Les informations de cette agence sont centralisées sur AURAX afin d’offrir une vitrine fiable aux acheteurs et locataires.',
  },
  {
    icon: Clock3,
    title: 'Annonces mises à jour',
    description:
      'Les biens publiés sont régulièrement actualisés pour présenter les disponibilités les plus récentes.',
  },
  {
    icon: MessageCircle,
    title: 'Contact direct',
    description:
      'Échangez directement avec l’agence via WhatsApp ou téléphone, sans intermédiaire.',
  },
  {
    icon: Sparkles,
    title: 'Toute la vitrine au même endroit',
    description:
      'Retrouvez l’ensemble des biens de cette agence sur une seule page AURAX.',
  },
]

export default function PublicAgencyAdvantages() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-10">

        <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
          Pourquoi choisir cette agence ?
        </span>

        <h2 className="mt-3 text-3xl font-black text-slate-900">
          Une expérience simple et transparente
        </h2>

        <p className="mt-3 max-w-2xl text-slate-500 leading-7">
          Cette page AURAX rassemble tous les biens de cette agence afin de
          faciliter vos recherches et vos prises de contact.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {advantages.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 p-6 transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <Icon className="h-7 w-7 text-emerald-600" />
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                {item.description}
              </p>
            </div>
          )
        })}

      </div>

    </section>
  )
}