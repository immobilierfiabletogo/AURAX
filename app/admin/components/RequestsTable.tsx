'use client'

import {
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react'

import type { Tables } from '@/types/database'
import RequestStatusBadge from '@/components/requests/RequestStatusBadge'
import RequestActions from '@/components/requests/RequestActions'

type Request = Tables<'requests'>

interface RequestsTableProps {
  requests: Request[]
  loading?: boolean
  onToggle: (
    id: string,
    current: boolean
  ) => void
  onDelete: (
    id: string
  ) => void
  onView: (request: Request) => void
}

export default function RequestsTable({
  requests,
  loading = false,
  onToggle,
  onDelete,
}: RequestsTableProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border bg-white p-12 text-center text-slate-500">
        Chargement des demandes...
      </div>
    )
  }

  if (!requests.length) {
    return (
      <div className="rounded-3xl border border-dashed bg-white p-12 text-center text-slate-500">
        Aucune demande enregistrée.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm font-semibold text-slate-600">

              <th className="px-6 py-4">
                Type
              </th>

              <th className="px-6 py-4">
                Quartier
              </th>

              <th className="px-6 py-4">
                Budget
              </th>

              <th className="px-6 py-4">
                Contact
              </th>

              <th className="px-6 py-4">
                Statut
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {requests.map((request) => (

              <tr
                key={request.id}
                className="border-t"
              >

                <td className="px-6 py-5 font-semibold">
                  {request.type}
                </td>

                <td className="px-6 py-5">
                  {request.quartier || '-'}
                </td>

                <td className="px-6 py-5">

                  {request.budget
                    ? `${new Intl.NumberFormat('fr-FR').format(request.budget)} FCFA`
                    : '-'}

                </td>

                <td className="px-6 py-5">
                  {request.user_contact}
                </td>

                <td className="px-6 py-5">

                  <RequestStatusBadge
                    isActive={request.is_active ?? false}
                  />

                </td>

                <td className="px-6 py-5">

                  <RequestActions
                     request={request.id}
                     isActive={request.is_active ?? false}
                     onToggle={onToggle}
                     onDelete={onDelete}
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}