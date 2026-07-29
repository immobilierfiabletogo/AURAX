'use client'

import {
  Phone,
  Globe,
  MapPin,
  Building2,
  BadgeCheck,
} from 'lucide-react'

interface Props {
  name: string
  phone: string
  address?: string | null
  website?: string | null
  verified?: boolean
}

export default function PublicAgencyContactCard({
  name,
  phone,
  address,
  website,
  verified = false,
}: Props) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <Building2 className="h-6 w-6" />
        </div>

        <div>

          <div className="flex items-center gap-2">

            <h3 className="text-lg font-black text-slate-900">
              {name}
            </h3>

            {verified && (
              <BadgeCheck className="h-5 w-5 text-emerald-500" />
            )}

          </div>

          <p className="text-sm text-slate-500">
            Agence immobilière partenaire
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-5">

        <div className="flex items-center gap-3">

          <Phone className="h-5 w-5 text-emerald-600" />

          <a
            href={`https://wa.me/${phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-800 hover:text-emerald-600"
          >
            {phone}
          </a>

        </div>

        {address && (

          <div className="flex items-start gap-3">

            <MapPin className="mt-0.5 h-5 w-5 text-slate-500" />

            <span className="text-slate-600">
              {address}
            </span>

          </div>

        )}

        {website && (

          <div className="flex items-start gap-3">

            <Globe className="mt-0.5 h-5 w-5 text-slate-500" />

            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-slate-700 hover:text-emerald-600"
            >
              {website}
            </a>

          </div>

        )}

      </div>

      <div className="mt-8">

        <a
          href={`https://wa.me/${phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Contacter sur WhatsApp
        </a>

      </div>

    </aside>
  )
}