'use client'

import { useMemo, useState } from 'react'

import RequestFilters from '@/components/requests/RequestFilters'
import RequestStats from '@/components/requests/RequestStats'
import RequestDetailsModal from '@/components/requests/RequestDetailsModal'

import type { Tables } from '@/types/database'

import useAdminRequests from '../hooks/useAdminRequests'
import RequestsTable from './RequestsTable'

type Request = Tables<'requests'>

const ITEMS_PER_PAGE = 10

export default function AdminRequestsTab() {
  const {
    requests,
    loading,
    toggleActive,
    deleteRequest,
  } = useAdminRequests()

  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [onlyActive, setOnlyActive] = useState(false)

  const [selectedRequest, setSelectedRequest] =
    useState<Request | null>(null)

  const [detailsOpen, setDetailsOpen] =
    useState(false)

  const [page, setPage] = useState(1)

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        search === '' ||
        request.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        request.quartier
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        request.type
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesType =
        type === '' ||
        request.type === type

      const matchesActive =
        !onlyActive ||
        request.is_active

      return (
        matchesSearch &&
        matchesType &&
        matchesActive
      )
    })
  }, [
    requests,
    search,
    type,
    onlyActive,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRequests.length /
        ITEMS_PER_PAGE
    )
  )

  const paginatedRequests =
    filteredRequests.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    )

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">
            Demandes immobilières
          </h2>

          <p className="text-slate-500">
            Gestion des demandes utilisateurs.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            Page {page} sur {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((p) => p - 1)
              }
              className="rounded-xl border px-4 py-2 disabled:opacity-40"
            >
              Précédent
            </button>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage((p) => p + 1)
              }
              className="rounded-xl border px-4 py-2 disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <RequestStats
        requests={paginatedRequests}
      />

      <RequestFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        onlyActive={onlyActive}
        onOnlyActiveChange={
          setOnlyActive
        }
      />

      <RequestsTable
        requests={paginatedRequests}
        loading={loading}
        onToggle={toggleActive}
        onDelete={deleteRequest}
        onView={(request) => {
          setSelectedRequest(request)
          setDetailsOpen(true)
        }}
      />

      <RequestDetailsModal
        request={selectedRequest}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false)
          setSelectedRequest(null)
        }}
      />
    </section>
  )
}