'use client'

import Link from 'next/link'
import {
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Mail,
} from 'lucide-react'

interface AgencyContactCardProps {
  fullName: string
  phone: string
  address?: string | null
  website?: string | null
  email?: string | null
}

export default function AgencyContactCard({
  fullName,
  phone,
  address,
  website,
  email,
}: AgencyContactCardProps) {
  const cleanPhone = phone.replace(/\D/g, '')

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sticky top-24">

      <div className="mb-6">

        <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          Contact
        </div>

        <h2 className="mt-2 text-2xl font-black text-slate-900">
          {fullName}
        </h2>

      </div>

      <div className="space-y-3">

        <Link
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Link>

        <Link
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <Phone className="h-4 w-4" />
          Appeler
        </Link>

      </div>

      <div className="mt-8 space-y-4 text-sm text-slate-600">

        {address && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span>{address}</span>
          </div>
        )}

        {website && (
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

            <Link
              href={website}
              target="_blank"
              className="break-all hover:text-slate-900"
            >
              {website}
            </Link>

          </div>
        )}

        {email && (
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

            <Link
              href={`mailto:${email}`}
              className="break-all hover:text-slate-900"
            >
              {email}
            </Link>

          </div>
        )}

      </div>

      <div className="mt-8 rounded-2xl bg-slate-50 p-4">

        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          AURAX
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Retrouvez l'ensemble des biens publiés par cette agence sur sa
          vitrine AURAX.
        </p>

      </div>

    </aside>
  )
}