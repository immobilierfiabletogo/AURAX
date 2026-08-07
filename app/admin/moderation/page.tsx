"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Home } from "lucide-react";

export default function ModerationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>

          <p className="mb-2 text-xs font-black uppercase tracking-wider text-emerald-600">
            AURAX
          </p>

          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Modération des annonces désactivée
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            Les annonces ne nécessitent plus de validation manuelle.
            Elles peuvent être publiées directement selon leur état
            d&apos;activation.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;administration
            </button>

            <button
              type="button"
              onClick={() => router.push("/biens")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Home className="h-4 w-4" />
              Voir les annonces
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}