'use client'

import Link from 'next/link'

export default function AgenciesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700">
      {/* Halos lumineux */}
      <div className="absolute -right-40 -top-44 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -bottom-48 -left-36 h-[420px] w-[420px] rounded-full bg-emerald-300/10 blur-3xl" />

      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Dégradé supplémentaire */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.08),transparent_55%)]" />

      {/* Logo géant */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="select-none text-[96px] font-black uppercase tracking-[14px] text-white/[0.03] sm:text-[140px] sm:tracking-[18px] md:text-[200px] md:tracking-[22px] lg:text-[280px] lg:tracking-[28px]">
          AURAX
        </span>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center sm:px-8 sm:py-24 md:py-28 lg:py-36">
        {/* Badge */}
        <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-100">
            Réseau d'agences immobilières
          </span>
        </div>

        {/* Titre */}
        <h1 className="mt-8 max-w-5xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Découvrez les agences immobilières présentes sur{' '}
          <span className="text-emerald-200">AURAX</span>
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-3xl text-base leading-8 text-emerald-50/90 sm:text-lg sm:leading-9 md:text-xl">
          Explorez les agences qui développent leur présence sur AURAX,
          consultez leurs catalogues et prenez directement contact avec des
          professionnels de confiance.
        </p>

        {/* CTA */}
        <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-900 shadow-[0_20px_50px_rgba(255,255,255,.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(255,255,255,.22)] sm:w-auto"
          >
            Rejoindre AURAX
          </Link>
        </div>

        {/* Statistiques */}
        <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <p className="text-3xl font-black text-white">100%</p>
            <p className="mt-2 text-sm text-emerald-100">
              Agences vérifiées avant publication
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <p className="text-3xl font-black text-white">24/7</p>
            <p className="mt-2 text-sm text-emerald-100">
              Visibilité permanente de vos annonces
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <p className="text-3xl font-black text-white">Direct</p>
            <p className="mt-2 text-sm text-emerald-100">
              Contact immédiat avec chaque agence
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}