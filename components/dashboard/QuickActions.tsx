'use client'

import Link from 'next/link'
import {
  PlusCircle,
  Building2,
  Zap,
  CreditCard,
  BarChart3,
  User,
} from 'lucide-react'

interface Action {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}

const actions: Action[] = [
  {
    title: 'Nouvelle annonce',
    description: 'Publier un nouveau bien',
    href: '/deposer',
    icon: <PlusCircle className="h-5 w-5" />,
    color: 'bg-emerald-500',
  },
  {
    title: 'Ma page AURAX',
    description: 'Voir votre vitrine publique',
    href: '/agence/me',
    icon: <Building2 className="h-5 w-5" />,
    color: 'bg-blue-500',
  },
  {
    title: 'Booster une annonce',
    description: 'Gagner plus de visibilité',
    href: '/dashboard-agence/boost',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-amber-500',
  },
  {
    title: 'Mon abonnement',
    description: 'Gérer votre plan',
    href: '/dashboard-agence/abonnement',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'bg-violet-500',
  },
  {
    title: 'Statistiques',
    description: 'Consulter vos performances',
    href: '/dashboard-agence/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'bg-cyan-500',
  },
  {
    title: 'Mon profil',
    description: 'Modifier vos informations',
    href: '/dashboard-agence/profil',
    icon: <User className="h-5 w-5" />,
    color: 'bg-slate-700',
  },
]

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">

      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900">
          Actions rapides
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Accédez rapidement aux principales fonctionnalités.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {actions.map((action) => (

          <Link
            key={action.title}
            href={action.href}
            className="group rounded-2xl border border-slate-200 p-5 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white ${action.color}`}
            >
              {action.icon}
            </div>

            <h3 className="mt-5 text-base font-black text-slate-900">
              {action.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {action.description}
            </p>

          </Link>

        ))}

      </div>

    </section>
  )
}