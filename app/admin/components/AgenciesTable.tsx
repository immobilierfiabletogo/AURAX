'use client'

import { useMemo, useState } from 'react'
import type { PendingAgency } from '../hooks/useModeration'

interface Props {
  agencies: PendingAgency[]
  loading: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AgenciesTable({
  agencies,
  loading,
  onApprove,
  onReject,
}: Props) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return agencies

    return agencies.filter((agency) =>
      [
        agency.full_name,
        agency.phone_number,
        agency.adresse,
        agency.website,
      ]
        .filter(Boolean)
        .some((field) =>
          String(field).toLowerCase().includes(value)
        )
    )
  }, [agencies, search])

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 18,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: '#f5f7fb',
            }}
          >
            Agences à valider
          </h2>

          <p
            style={{
              margin: '6px 0 0',
              color: '#747b8c',
              fontSize: 13,
            }}
          >
            Toutes les agences dont la vérification est encore en attente.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 34,
              height: 30,
              padding: '0 10px',
              borderRadius: 999,
              background: 'rgba(245,158,11,0.12)',
              color: '#f59e0b',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {agencies.length}
          </span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une agence..."
            style={{
              width: 240,
              maxWidth: '100%',
              padding: '10px 13px',
              borderRadius: 10,
              border:
                '1px solid rgba(255,255,255,0.08)',
              background:
                'rgba(255,255,255,0.035)',
              color: '#f5f7fb',
              outline: 'none',
              fontSize: 12,
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <div
        style={{
          border:
            '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.018)',
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 50,
              textAlign: 'center',
              color: '#747b8c',
              fontSize: 13,
            }}
          >
            Chargement des agences...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: 55,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 28,
                marginBottom: 10,
              }}
            >
              ✓
            </div>

            <div
              style={{
                color: '#f5f7fb',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Aucune agence en attente
            </div>

            <div
              style={{
                marginTop: 5,
                color: '#747b8c',
                fontSize: 12,
              }}
            >
              Toutes les demandes d'agence ont été traitées.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                minWidth: 760,
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr>
                  {[
                    'Agence',
                    'Contact',
                    'Localisation',
                    'Inscription',
                    'Statut',
                    'Actions',
                  ].map((label) => (
                    <th
                      key={label}
                      style={{
                        padding: '13px 16px',
                        textAlign: 'left',
                        borderBottom:
                          '1px solid rgba(255,255,255,0.06)',
                        color: '#555d6f',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '1.2px',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((agency) => (
                  <tr key={agency.id}>
                    <td
                      style={{
                        padding: '15px 16px',
                        borderBottom:
                          '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 11,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 11,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background:
                              'linear-gradient(135deg, #10b981, #047857)',
                            color: '#fff',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {agency.avatar_url ? (
                            <img
                              src={agency.avatar_url}
                              alt=""
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            agency.full_name
                              ?.charAt(0)
                              ?.toUpperCase() ?? 'A'
                          )}
                        </div>

                        <div>
                          <div
                            style={{
                              color: '#f1f4f8',
                              fontSize: 13,
                              fontWeight: 750,
                            }}
                          >
                            {agency.full_name || 'Agence sans nom'}
                          </div>

                          {agency.website && (
                            <div
                              style={{
                                marginTop: 3,
                                color: '#697184',
                                fontSize: 11,
                              }}
                            >
                              {agency.website}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td
                      style={{
                        padding: '15px 16px',
                        color: '#aab1bf',
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                        borderBottom:
                          '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      {agency.phone_number || '—'}
                    </td>

                    <td
                      style={{
                        padding: '15px 16px',
                        color: '#8b93a3',
                        fontSize: 12,
                        maxWidth: 180,
                        borderBottom:
                          '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      {agency.adresse || 'Non renseignée'}
                    </td>

                    <td
                      style={{
                        padding: '15px 16px',
                        color: '#747b8c',
                        fontSize: 11,
                        whiteSpace: 'nowrap',
                        borderBottom:
                          '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      {formatDate(agency.created_at)}
                    </td>

                    <td
                      style={{
                        padding: '15px 16px',
                        borderBottom:
                          '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '5px 9px',
                          borderRadius: 999,
                          background:
                            'rgba(245,158,11,0.10)',
                          color: '#f59e0b',
                          fontSize: 10,
                          fontWeight: 750,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: '#f59e0b',
                          }}
                        />
                        En attente
                      </span>
                    </td>

                    <td
                      style={{
                        padding: '15px 16px',
                        borderBottom:
                          '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: 7,
                        }}
                      >
                        <button
                          onClick={() =>
                            onApprove(agency.id)
                          }
                          style={approveButton}
                        >
                          Approuver
                        </button>

                        <button
                          onClick={() =>
                            onReject(agency.id)
                          }
                          style={rejectButton}
                        >
                          Refuser
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

const approveButton: React.CSSProperties = {
  border: '1px solid rgba(16,185,129,0.25)',
  background: 'rgba(16,185,129,0.10)',
  color: '#34d399',
  borderRadius: 8,
  padding: '7px 11px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const rejectButton: React.CSSProperties = {
  border: '1px solid rgba(239,68,68,0.20)',
  background: 'rgba(239,68,68,0.08)',
  color: '#f87171',
  borderRadius: 8,
  padding: '7px 11px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}