'use client'

import Link from 'next/link'
import {
  BadgeCheck,
  Building2,
  Globe,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react'

import type { Profile } from '@/types'

interface AgencyHeroProps {
  agency: Profile
}

export default function AgencyHero({
  agency,
}: AgencyHeroProps) {
  const planLabel =
    agency.plan === 'premium'
      ? 'AURAX PREMIUM'
      : agency.plan === 'pro'
      ? 'AURAX PRO'
      : 'AURAX START'

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-slate-200/80
        bg-white
        shadow-[0_25px_60px_rgba(15,23,42,.08)]
      "
    >

      {/* Background glow */}

      <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-amber-300/15 blur-[140px]" />
      <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-emerald-400/15 blur-[140px]" />

      {/* COVER */}

      <div className="relative h-[420px] overflow-hidden">

        {agency.cover_url ? (

          <img
            src={agency.cover_url}
            alt={agency.full_name}
            className="h-full w-full object-cover"
          />

        ) : (

          <div
            className="
              h-full
              w-full
              bg-gradient-to-br
              from-slate-950
              via-slate-900
              to-emerald-900
            "
          />

        )}

        {/* Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-slate-950
            via-slate-950/45
            to-black/10
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/50
            via-transparent
            to-emerald-900/20
          "
        />

      </div>

      {/* CONTENT */}

      <div className="relative px-8 pb-10">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end">

          {/* Avatar */}

          <div
            className={`
              relative
              shrink-0
              ${
                agency.cover_url
                  ? '-mt-28'
                  : '-mt-24'
              }
            `}
          >

            <div
              className="
                rounded-[34px]
                border-4
                border-white
                bg-white
                p-1
                shadow-[0_30px_70px_rgba(0,0,0,.20)]
              "
            >

              {agency.avatar_url ? (

                <img
                  src={agency.avatar_url}
                  alt={agency.full_name}
                  className="
                    h-36
                    w-36
                    rounded-[28px]
                    object-cover
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    h-36
                    w-36
                    items-center
                    justify-center
                    rounded-[28px]
                    bg-gradient-to-br
                    from-slate-100
                    to-slate-200
                  "
                >
                  <Building2 className="h-16 w-16 text-slate-500" />
                </div>

              )}

            </div>

          </div>

          {/* Informations */}

          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-3">

              <span
                className="
                  rounded-full
                  bg-emerald-50
                  px-4
                  py-2
                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.30em]
                  text-emerald-700
                "
              >
                Stand officiel
              </span>

              {agency.verified && (

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-emerald-600
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  <BadgeCheck className="h-4 w-4" />
                  Agence vérifiée
                </span>

              )}

              <span
                className="
                  rounded-full
                  bg-gradient-to-r
                  from-amber-500
                  to-amber-400
                  px-4
                  py-2
                  text-xs
                  font-black
                  uppercase
                  tracking-wider
                  text-white
                  shadow-lg
                "
              >
                {planLabel}
              </span>

            </div>

            <h1
              className="
                mt-6
                text-4xl
                font-black
                tracking-tight
                text-slate-950
                lg:text-5xl
              "
            >
              {agency.full_name}
            </h1>

            <p
              className="
                mt-4
                max-w-3xl
                text-lg
                leading-8
                text-slate-600
              "
            >
              {agency.description ??
                "Professionnel de l'immobilier partenaire d'AURAX. Découvrez une sélection de biens rigoureusement choisis et bénéficiez d'un accompagnement personnalisé tout au long de votre projet immobilier."}
            </p>

                        {/* Informations */}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              {agency.adresse && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50/80
                    p-5
                    backdrop-blur-sm
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                      <MapPin className="h-5 w-5 text-emerald-700" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Adresse
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {agency.adresse}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {agency.phone_number && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50/80
                    p-5
                    backdrop-blur-sm
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                      <Phone className="h-5 w-5 text-emerald-700" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Téléphone
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {agency.phone_number}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {agency.website && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50/80
                    p-5
                    backdrop-blur-sm
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                      <Globe className="h-5 w-5 text-emerald-700" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Site web
                      </p>

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {agency.website.replace(/^https?:\/\//, '')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Boutons */}

            <div className="mt-10 flex flex-wrap gap-4">

              {agency.phone_number && (
                <a
                  href={`tel:${agency.phone_number}`}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-emerald-700
                    to-emerald-500
                    px-7
                    py-4
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-2xl
                  "
                >
                  <Phone className="h-4 w-4" />
                  Appeler l'agence
                </a>
              )}

              {agency.phone_number && (
                <a
                  href={`https://wa.me/${agency.phone_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-emerald-200
                    bg-white
                    px-7
                    py-4
                    text-sm
                    font-bold
                    text-emerald-700
                    transition-all
                    duration-300
                    hover:border-emerald-600
                    hover:bg-emerald-50
                  "
                >
                  WhatsApp
                </a>
              )}

              {agency.website && (
                <Link
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-7
                    py-4
                    text-sm
                    font-bold
                    text-slate-700
                    transition-all
                    duration-300
                    hover:border-slate-300
                    hover:bg-slate-100
                  "
                >
                  Visiter le site

                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

            </div>

          </div>

          {/* Bloc marketing */}

          <div
            className="
              w-full
              rounded-[30px]
              border
              border-emerald-100
              bg-gradient-to-br
              from-emerald-600
              via-emerald-700
              to-slate-900
              p-8
              text-white
              shadow-2xl
              lg:max-w-sm
            "
          >
            <span className="text-xs font-bold uppercase tracking-[0.30em] text-emerald-100">
              AURAX
            </span>

            <h3 className="mt-4 text-3xl font-black leading-tight">
              Votre partenaire immobilier de confiance
            </h3>

            <p className="mt-5 text-sm leading-8 text-emerald-50/90">
              Cette agence accompagne particuliers et investisseurs
              avec une sélection de biens vérifiés et un suivi
              professionnel à chaque étape de votre projet.
            </p>

            <div className="mt-8 space-y-3">

              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-amber-300" />
                <span className="text-sm">
                  Profil vérifié par AURAX
                </span>
              </div>

              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-amber-300" />
                <span className="text-sm">
                  Accompagnement personnalisé
                </span>
              </div>

              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-amber-300" />
                <span className="text-sm">
                  Transactions sécurisées
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  )
}