'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import AdminHeader from './components/AdminHeader'
import StatsCards from './components/StatsCards'
import ListingsTable from './components/ListingsTable'
import UsersTable from './components/UsersTable'
import AgenciesTable from './components/AgenciesTable'
import Toast from './components/Toast'
import PaymentsTable from './components/PaymentsTable'
import AdminRequestsTab from './components/AdminRequestsTab'
import AdminTabs, { type Tab } from './components/AdminTabs'

import { useAdminListings } from './hooks/useAdminListings'
import { useAdminUsers } from './hooks/useAdminUsers'
import { useModeration } from './hooks/useModeration'
import { useMonetization } from './hooks/useMonetization'
import { usePayments } from './hooks/usePayments'

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<Tab>('stats')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const [toast, setToast] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)

  const showToast = useCallback(
    (
      text: string,
      type: 'success' | 'error' = 'success'
    ) => {
      setToast({ text, type })

      window.setTimeout(() => {
        setToast(null)
      }, 4000)
    },
    []
  )

  /*
   * ANNONCES
   */
  const {
    listings,
    loadListings,
    toggleActive,
    toggleBoost,
    deleteListing,
  } = useAdminListings(showToast)

  /*
   * UTILISATEURS
   */
  const {
    users,
    loadUsers,
    editingSub,
    setEditingSub,
    subPlan,
    setSubPlan,
    subMonths,
    setSubMonths,
    toggleUserType,
    activateSubscription,
    cancelSubscription,
  } = useAdminUsers(showToast)

  /*
   * MODÉRATION DES AGENCES
   *
   * Ce hook gère uniquement les agences
   * dont verification_status = pending.
   */
  const {
    loading: agenciesLoading,
    agencies,
    approve: approveAgency,
    reject: rejectAgency,
  } = useModeration(showToast)

  /*
   * MONÉTISATION
   */
  const {
    monetizationEnabled,
    loadingToggle,
    loadMonetization,
    toggleMonetization,
  } = useMonetization(showToast)

  /*
   * PAIEMENTS
   */
  const {
    payments,
    loading: paymentsLoading,
    loadPayments,
    approvePayment,
    rejectPayment,
  } = usePayments(showToast)

  /*
   * INITIALISATION + SÉCURITÉ ADMIN
   */
  useEffect(() => {
    let mounted = true

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (
        profileError ||
        !profile?.is_admin
      ) {
        router.push('/')
        return
      }

      /*
       * Chargement initial des données admin.
       *
       * IMPORTANT :
       * Les annonces ne sont PAS filtrées par status.
       * Elles sont déjà considérées comme publiables.
       */
      await Promise.all([
        loadListings(),
        loadUsers(),
        loadMonetization(),
        loadPayments(),
      ])

      if (mounted) {
        setLoading(false)
      }
    }

    init()

    /*
     * REALTIME — UTILISATEURS / PROFILS
     */
    const usersChannel = supabase
      .channel('admin-profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (
            payload.eventType === 'INSERT'
          ) {
            const newUser =
              payload.new as {
                full_name?: string | null
              }

            showToast(
              `Nouvel utilisateur : ${
                newUser.full_name ??
                'Nouvel utilisateur'
              }`
            )

            setUnreadCount(
              (count) => count + 1
            )
          }

          loadUsers()
        }
      )
      .subscribe()

    /*
     * REALTIME — ANNONCES
     *
     * IMPORTANT :
     * Aucun système "pending" ici.
     *
     * Toute modification d'une annonce
     * recharge simplement la liste admin.
     */
    const listingsChannel = supabase
      .channel('admin-listings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings',
        },
        () => {
          loadListings()
        }
      )
      .subscribe()

    /*
     * REALTIME — PAIEMENTS
     */
    const paymentsChannel = supabase
      .channel('admin-payments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_submissions',
        },
        (payload) => {
          if (
            payload.eventType === 'INSERT'
          ) {
            showToast(
              'Nouvelle demande de paiement'
            )

            setUnreadCount(
              (count) => count + 1
            )
          }

          loadPayments()
        }
      )
      .subscribe()

    /*
     * IMPORTANT :
     *
     * useModeration possède déjà son propre
     * abonnement realtime sur profiles.
     *
     * On ne crée donc pas un deuxième
     * abonnement spécifique aux agences ici.
     */

    return () => {
      mounted = false

      supabase.removeChannel(
        usersChannel
      )

      supabase.removeChannel(
        listingsChannel
      )

      supabase.removeChannel(
        paymentsChannel
      )
    }
  }, [])

  /*
   * CHANGEMENT D'ONGLET
   */
  const handleTabChange = (nextTab: Tab) => {
    setTab(nextTab)
    setSearch('')
  }

  /*
   * DÉCONNEXION
   */
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  /*
   * LOADING INITIAL
   */
  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#080b0f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          color: '#697184',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              margin: '0 auto 16px',
              borderRadius: 13,
              background:
                'linear-gradient(135deg, #10b981, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            A
          </div>

          <div
            style={{
              color: '#d9dde5',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Chargement de la console AURAX
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 12,
            }}
          >
            Vérification des accès...
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #080b0f;
        }

        body {
          min-height: 100vh;
        }

        button,
        input {
          font-family: inherit;
        }

        ::selection {
          background: rgba(16, 185, 129, 0.25);
        }

        @media (max-width: 700px) {
          .admin-container {
            padding: 18px 14px !important;
          }
        }
      `}</style>

      <main
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top right, rgba(16,185,129,0.055), transparent 30%), #080b0f',
          color: '#e8eaf0',
        }}
      >
        <AdminHeader
          unreadCount={unreadCount}
          onClearNotifs={() =>
            setUnreadCount(0)
          }
          monetizationEnabled={
            monetizationEnabled
          }
          loadingToggle={loadingToggle}
          onToggleMonetization={
            toggleMonetization
          }
          onLogout={handleLogout}
        />

        <Toast message={toast} />

        <div
          className="admin-container"
          style={{
            width: '100%',
            maxWidth: 1380,
            margin: '0 auto',
            padding: '30px 24px 50px',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              marginBottom: 22,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#34d399',
                fontWeight: 800,
                letterSpacing: '1.6px',
                textTransform: 'uppercase',
                marginBottom: 7,
              }}
            >
              AURAX / Administration
            </div>

            <h1
              style={{
                margin: 0,
                color: '#f5f7fb',
                fontSize:
                  'clamp(24px, 4vw, 32px)',
                lineHeight: 1.1,
                fontWeight: 850,
                letterSpacing: '-0.8px',
              }}
            >
              Console d’administration
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                color: '#697184',
                fontSize: 13,
              }}
            >
              Gérez les annonces, agences,
              utilisateurs, paiements et
              demandes.
            </p>
          </div>

          {/* NAVIGATION */}
          <AdminTabs
            tab={tab}
            onTabChange={handleTabChange}
            totalAnnonces={listings.length}
            totalAgencies={agencies.length}
            totalUsers={users.length}
            totalPayments={payments.length}
          />

          {/* STATISTIQUES */}
          {tab === 'stats' && (
            <StatsCards
              listings={listings}
              users={users}
            />
          )}

          {/* ANNONCES */}
          {tab === 'annonces' && (
            <ListingsTable
              listings={listings}
              search={search}
              onSearch={setSearch}
              onToggleActive={
                toggleActive
              }
              onToggleBoost={
                toggleBoost
              }
              onDelete={deleteListing}
            />
          )}

          {/* AGENCES EN ATTENTE */}
          {tab === 'agences' && (
            <AgenciesTable
              agencies={agencies}
              loading={agenciesLoading}
              onApprove={approveAgency}
              onReject={rejectAgency}
            />
          )}

          {/* UTILISATEURS */}
          {tab === 'utilisateurs' && (
            <UsersTable
              users={users}
              search={search}
              onSearch={setSearch}
              editingSub={editingSub}
              subPlan={subPlan}
              subMonths={subMonths}
              onToggleUserType={
                toggleUserType
              }
              onSetEditingSub={
                setEditingSub
              }
              onSubPlanChange={
                setSubPlan
              }
              onSubMonthsChange={
                setSubMonths
              }
              onActivateSub={
                activateSubscription
              }
              onCancelSub={
                cancelSubscription
              }
            />
          )}

          {/* PAIEMENTS */}
          {tab === 'paiements' && (
            <PaymentsTable
              payments={payments}
              loading={paymentsLoading}
              onApprove={
                approvePayment
              }
              onReject={
                rejectPayment
              }
            />
          )}

          {/* DEMANDES */}
          {tab === 'requests' && (
            <AdminRequestsTab />
          )}
        </div>
      </main>
    </>
  )
}