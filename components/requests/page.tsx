import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

import { createClient } from '@/utils/supabase'
import RequestGrid from '@/components/requests/RequestGrid'
import type { Tables } from '@/types/database'

type Request = Tables<'requests'>

export const metadata = {
  title: 'Demandes immobilières | AURAX',
  description:
    "Consultez les demandes immobilières publiées par les utilisateurs d'AURAX.",
}

export default async function RequestsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('requests')
    .select('*')
    .eq('is_active', true)
    .order('created_at', {
      ascending: false,
    })

  const requests = (data ?? []) as Request[]

  return (
    <main className="min-h-screen bg-slate-50">

      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">

                <Search className="h-4 w-4" />

                Demandes immobilières

              </span>

              <h1 className="mt-6 text-5xl font-black text-slate-900">
                Des clients recherchent un bien.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Consultez les demandes publiées sur AURAX et découvrez
                les besoins réels des acheteurs et locataires.
              </p>

            </div>

            <Link
              href="/demandes/nouvelle"
              className="inline-flex items-center gap-3 self-start rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-5 w-5" />
              Publier une demande
            </Link>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">

        <RequestGrid
          requests={requests}
        />

      </section>

    </main>
  )
}