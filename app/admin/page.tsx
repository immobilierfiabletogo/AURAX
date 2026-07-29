'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

import AdminHeader from './components/AdminHeader'
import StatsCards from './components/StatsCards'
import ListingsTable from './components/ListingsTable'
import UsersTable from './components/UsersTable'
import Toast from './components/Toast'
import PaymentsTable from './components/PaymentsTable'
import AdminRequestsTab from "./components/AdminRequestsTab";

import { useAdminListings } from './hooks/useAdminListings'
import { useAdminUsers } from './hooks/useAdminUsers'
import { useMonetization } from './hooks/useMonetization'
import { usePayments } from './hooks/usePayments'
import { approvePaymentAction, rejectPaymentAction,} from "./actions/payments";
import AdminTabs, { type Tab } from "./components/AdminTabs";


export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  type AdminTab =
  | 'stats'
  | 'annonces'
  | 'utilisateurs'
  | 'paiements'
  | 'requests'

  const [tab, setTab] = useState<AdminTab>('stats')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 4000)
  }

  const {
    listings,
    loadListings,
    toggleActive,
    toggleBoost,
    deleteListing,
  } = useAdminListings(showToast)

  const {
    users,
    setUsers,
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

  const {
    monetizationEnabled,
    loadingToggle,
    loadMonetization,
    toggleMonetization,
  } = useMonetization(showToast)

  const {
    payments,
    loading: paymentsLoading,
    loadPayments,
    approvePayment,
    rejectPayment,
  } = usePayments(showToast)

  useEffect(() => {
    const init = async () => {
     const {
       data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      router.push('/')
      return
    }

      await Promise.all([
        loadListings(),
        loadUsers(),
        loadMonetization(),
        loadPayments(),
      ])

      setLoading(false)
    }

    init()
    

    // Temps réel utilisateurs
    const usersChannel = supabase
      .channel('realtime:profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.eventType === 'INSERT') {
            showToast(`Nouvel utilisateur : ${payload.new.full_name}`)
            setUnreadCount((c) => c + 1)
          }

          loadUsers()
        }
      )
      .subscribe()

    // Temps réel annonces
    const listingsChannel = supabase
      .channel('realtime:listings')
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

      const paymentsChannel = supabase
  .channel('realtime:payments')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'payment_submissions',
    },
    (payload: RealtimePostgresChangesPayload<any>) => {
      if (payload.eventType === 'INSERT') {
        showToast('💳 Nouvelle demande de paiement')
        setUnreadCount((c) => c + 1)
      }

      loadPayments()
    }
  )
  .subscribe()

  const handleApprove = async (payment: any) => {
    const result =
      await approvePaymentAction(
        payment.id,
        payment.agent_id,
        payment.plan_requested,
        payment.months_requested
      );

    if (result.error) {
      showToast(result.error.message, "error");
      return;
    }

    showToast(
      "✅ Paiement validé et abonnement activé."
    );

    loadPayments();
    loadUsers();
  };

  const handleReject = async (payment: any) => {
    const result =
      await rejectPaymentAction(payment.id, payment.agent_id);

    if (result.error) {
      showToast(result.error.message, "error");
      return;
    }

    showToast("Paiement refusé.");

    loadPayments();
  };

    return () => {
      supabase.removeChannel(usersChannel)
      supabase.removeChannel(listingsChannel)
      supabase.removeChannel(paymentsChannel)
    }
  }, [])


  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0d0f14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5a5e70',
          fontWeight: 600,
        }}
      >
        Chargement de la console AURAX...
      </div>
    )
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #0d0f14 !important; }
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#0d0f14',
          color: '#e8eaf0',
          fontFamily: 'inherit',
        }}
      >
        <AdminHeader
          unreadCount={unreadCount}
          onClearNotifs={() => setUnreadCount(0)}
          monetizationEnabled={monetizationEnabled}
          loadingToggle={loadingToggle}
          onToggleMonetization={toggleMonetization}
          onLogout={handleLogout}
        />

        <Toast message={toast} />

        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '28px 24px',
          }}
        >
          <AdminTabs
           tab={tab}
          onTabChange={(t) => {
            setTab(t)
            setSearch('')
          }}
          totalAnnonces={listings.length}
          totalUsers={users.length}
          totalPayments={payments.length}
        />

          {tab === 'stats' && (
            <StatsCards listings={listings} users={users} />
          )}



          {tab === "requests" && (
            <AdminRequestsTab />
          )}

          {tab === 'annonces' && (
            <ListingsTable
              listings={listings}
              search={search}
              onSearch={setSearch}
              onToggleActive={toggleActive}
              onToggleBoost={toggleBoost}
              onDelete={deleteListing}
            />
          )}

          {tab === 'utilisateurs' && (
            <UsersTable
              users={users}
              search={search}
              onSearch={setSearch}
              editingSub={editingSub}
              subPlan={subPlan}
              subMonths={subMonths}
              onToggleUserType={toggleUserType}
              onSetEditingSub={setEditingSub}
              onSubPlanChange={setSubPlan}
              onSubMonthsChange={setSubMonths}
              onActivateSub={activateSubscription}
              onCancelSub={cancelSubscription}
            />
          )}

          {tab === 'paiements' && (
           <PaymentsTable
             payments={payments}
             loading={paymentsLoading}
             onApprove={approvePayment}
             onReject={rejectPayment}
            />
          )}
        </div>
      </div>
    </>
  )
}