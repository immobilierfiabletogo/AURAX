import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  MapPin,
  Phone,
  Search,
} from "lucide-react";

import { createClient } from "@/utils/supabase";
import type { Tables } from "@/types/database";

type Request = Tables<"requests">;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RequestDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const request = data as Request;

  return (
    <main className="min-h-screen bg-slate-50">

      <section className="border-b bg-white">

        <div className="mx-auto max-w-5xl px-6 py-12">

          <Link
            href="/demandes"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux demandes
          </Link>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">

                <Search className="h-4 w-4" />

                Demande immobilière

              </span>

              <h1 className="mt-6 text-4xl font-black text-slate-900">
                Recherche : {request.type}
              </h1>

              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                {request.description || "Aucune description fournie."}
              </p>

            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-12 lg:grid-cols-[2fr_1fr]">

        <article className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-black">
            Détails
          </h2>

          <div className="space-y-5">

            {request.quartier && (

              <div className="flex items-center gap-3">

                <MapPin className="h-5 w-5 text-emerald-600" />

                <span>{request.quartier}</span>

              </div>

            )}

            {request.budget && (

              <div className="flex items-center gap-3">

                <Banknote className="h-5 w-5 text-emerald-600" />

                <span className="font-semibold">
                  {new Intl.NumberFormat("fr-FR").format(
                    request.budget
                  )}{" "}
                  FCFA
                </span>

              </div>

            )}

            <div className="flex items-center gap-3">

              <Phone className="h-5 w-5 text-emerald-600" />

              <span>{request.user_contact}</span>

            </div>

            {request.created_at && (

              <div className="flex items-center gap-3">

                <Calendar className="h-5 w-5 text-emerald-600" />

                <span>
                  {new Date(
                    request.created_at
                  ).toLocaleDateString("fr-FR")}
                </span>

              </div>

            )}

          </div>

        </article>

        <aside className="rounded-3xl border bg-white p-8">

          <h3 className="text-xl font-black">
            Contacter le demandeur
          </h3>

          <p className="mt-4 text-slate-600">
            Vous êtes une agence et vous disposez d'un bien correspondant ?
          </p>

          <a
            href={`https://wa.me/${request.user_contact}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block rounded-2xl bg-emerald-600 px-6 py-4 text-center font-bold text-white transition hover:bg-emerald-700"
          >
            Contacter sur WhatsApp
          </a>

        </aside>

      </section>

    </main>
  );
}