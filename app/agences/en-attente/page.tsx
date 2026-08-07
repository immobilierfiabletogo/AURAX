export default function EnAttentePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          ...
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Votre agence est en cours de vérification
        </h1>

        <p className="mt-3 text-slate-600">
          Votre demande d'inscription a bien été reçue.
          Notre équipe AURAX vérifie actuellement votre agence.
        </p>

        <p className="mt-3 text-sm text-slate-500">
          Vous pourrez accéder à votre espace agence dès que votre
          compte aura été validé.
        </p>
      </div>
    </main>
  )
}
