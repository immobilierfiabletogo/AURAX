'use client'

import {
  Home,
  Eye,
  MessageSquare,
  CheckCircle2,
  Zap,
} from 'lucide-react'

import { StatCard } from '@/components/ui'

interface Props {
  listings: number
  views: number
  whatsapp: number
  active: number
  boosted: number
}

export default function StatsOverview({
  listings,
  views,
  whatsapp,
  active,
  boosted,
}: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

      <StatCard
        title="Annonces"
        value={listings}
        icon={<Home size={20} />}
      />

      <StatCard
        title="Vues"
        value={views}
        icon={<Eye size={20} />}
      />

      <StatCard
        title="WhatsApp"
        value={whatsapp}
        icon={<MessageSquare size={20} />}
      />

      <StatCard
        title="Actives"
        value={active}
        color="text-emerald-600"
        icon={<CheckCircle2 size={20} />}
      />

      <StatCard
        title="Boostées"
        value={boosted}
        color="text-amber-500"
        icon={<Zap size={20} />}
      />

    </div>
  )
}