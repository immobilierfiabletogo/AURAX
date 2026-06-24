import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8 px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-bold text-slate-400">
          AURA<span className="text-emerald-600">X</span> — La plateforme immobilière du Togo
        </p>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <Link href="/confidentialite" className="hover:text-slate-700 transition-colors">
            Politique de confidentialité
          </Link>
          <span className="text-slate-200">·</span>
          <Link href="/cgu" className="hover:text-slate-700 transition-colors">
            Conditions d'utilisation
          </Link>
        </div>
        <p className="text-[11px] text-slate-300">
          © {new Date().getFullYear()} AURAX. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}