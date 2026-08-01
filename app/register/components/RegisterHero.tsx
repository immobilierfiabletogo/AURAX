'use client'

import Image from 'next/image'

export default function RegisterHero() {
  return (
    <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 px-6 py-16 text-center shadow-[0_40px_120px_rgba(6,78,59,.28)] sm:px-10 sm:py-20 lg:px-14 lg:py-24">
      {/* Halos */}
      <div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Logo géant */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="select-none text-[90px] font-black tracking-[16px] text-white/[0.03] sm:text-[140px] md:text-[200px] lg:text-[260px]">
          AURAX
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Logo */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
          <Image
            src="/logo-aurax.png"
            alt="AURAX"
            width={52}
            height={52}
            priority
          />
        </div>

        {/* Badge */}
        <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-100">
            Espace professionnel
          </span>
        </div>

        {/* Titre */}
        <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Ouvrez votre espace sur{' '}
          <span className="text-emerald-200">AURAX</span>
        </h1>

        {/* Texte */}
        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-emerald-50/90 sm:text-lg sm:leading-9">
          Rejoignez l'écosystème AURAX et développez votre présence auprès
          d'une clientèle exigeante. Une plateforme pensée pour valoriser
          les professionnels de l'immobilier.
        </p>

        {/* Signature */}
        <div className="mt-12 inline-flex rounded-full border border-white/10 bg-white/10 px-6 py-3 backdrop-blur-xl">
          <span className="text-sm font-medium text-emerald-50">
            Accès réservé aux agences, promoteurs et propriétaires.
          </span>
        </div>
      </div>
    </section>
  )
}