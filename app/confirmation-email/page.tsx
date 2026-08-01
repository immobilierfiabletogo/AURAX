import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ConfirmationEmailPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f7f5] px-6 py-16">

      {/* Halo décoratif */}

      <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-500/10 via-amber-300/10 to-transparent blur-3xl" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

      <section
        className="
          relative
          w-full
          max-w-xl
          overflow-hidden
          rounded-[32px]
          border
          border-slate-200/70
          bg-white/95
          p-10
          shadow-[0_30px_80px_rgba(15,23,42,.08)]
          backdrop-blur
        "
      >
        {/* Ligne décorative */}

        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

        {/* Badge */}

        <div className="mb-8 flex justify-center">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-700">
            Compte créé
          </span>
        </div>

        {/* Icône */}

        <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-gradient-to-br from-emerald-50 to-amber-50">

          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-400/10" />

          <Mail className="relative h-9 w-9 text-emerald-700" />

        </div>

        {/* Titre */}

        <h1 className="text-center text-4xl font-black tracking-tight text-slate-950">
          Vérifiez votre e-mail
        </h1>

        <p className="mx-auto mt-6 max-w-md text-center text-base leading-8 text-slate-500">
          Votre compte AURAX a été créé avec succès.
          <br />
          Nous avons envoyé un e-mail contenant un lien sécurisé
          permettant d'activer votre compte.
        </p>

        {/* Encadré */}

        <div className="mt-10 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-5">

          <p className="text-center text-sm leading-7 text-slate-600">
            Une fois votre adresse confirmée, vous pourrez accéder à
            votre espace AURAX et commencer à publier vos annonces.
          </p>

        </div>

        {/* Bouton */}

        <div className="mt-10">

          <Link
            href="/login"
            className="
              flex
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-r
              from-emerald-600
              via-emerald-500
              to-emerald-600
              px-6
              py-4
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-emerald-500/20
              transition
              hover:-translate-y-0.5
              hover:shadow-xl
              hover:shadow-emerald-500/30
            "
          >
            Retour à la connexion
          </Link>

        </div>

        {/* Pied */}

        <p className="mt-8 text-center text-sm text-slate-400">
          Vous n'avez pas reçu l'e-mail ?
          <br />
          Vérifiez votre dossier spam ou patientez quelques instants avant de réessayer.
        </p>

      </section>

    </main>
  )
}