'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/utils/supabase'

import AgencySidebar from './components/AgencySidebar'
import AgencyTopbar from './components/AgencyTopbar'
import CockpitHero from './components/CockpitHero'
import StatsGrid from './components/StatsGrid'
import ListingsToolbar from './components/ListingsToolbar'
import ListingsSection from './components/ListingsSection'

type PlanCode = 'pro' | 'premium'

interface Profile {
  full_name: string | null
  user_type: string | null
  plan: PlanCode | null
  plan_expires_at: string | null
  subscription_status: string | null
  verification_status: string | null
  phone_number: string | null
  avatar_url: string | null
}

interface Listing {
  id: string
  title: string
  price: number
  zone_saisie: string
  property_type: string
  images_urls: string[]
  is_boosted: boolean
  boosted_until: string | null
  created_at: string
  whatsapp_clicks: number
  views: number
  is_active?: boolean
}

function getStatut(
  listing: Listing
): 'actif' | 'expire' | 'en_attente' {
  if (!listing.boosted_until) {
    return 'en_attente'
  }

  return new Date(listing.boosted_until) > new Date()
    ? 'actif'
    : 'expire'
}

function hasActiveSubscription(
  profile: Profile
): boolean {
  if (
    (profile.plan !== 'pro' &&
      profile.plan !== 'premium') ||
    profile.subscription_status !== 'active' ||
    !profile.plan_expires_at
  ) {
    return false
  }

  return new Date(profile.plan_expires_at) > new Date()
}

export default function DashboardAgencePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)

  const [userId, setUserId] = useState('')

  const [profile, setProfile] =
    useState<Profile | null>(null)

  const [listings, setListings] =
    useState<Listing[]>([])

  const [search, setSearch] = useState('')

  const [filter, setFilter] = useState<
    'tous' | 'actif' | 'en_attente' | 'expire'
  >('tous')

  const [view, setView] =
    useState<'liste' | 'grille'>('liste')

  const [isSidebarOpen, setSidebarOpen] =
    useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      if (!mounted) return

      setUserId(user.id)

      const { data: profileData, error: profileError } =
        await supabase
          .from('profiles')
          .select(`
            full_name,
            user_type,
            plan,
            plan_expires_at,
            subscription_status,
            verification_status,
            phone_number,
            avatar_url
          `)
          .eq('id', user.id)
          .single()

      if (profileError || !profileData) {
        router.replace('/login')
        return
      }

      if (profileData.user_type !== 'agence') {
        router.replace('/')
        return
      }

      /*
       * Une agence doit d'abord être validée par AURAX.
       *
       * Tant que la vérification n'est pas approuvée,
       * elle ne doit pas accéder au Dashboard.
       */
      if (
        profileData.verification_status !==
        'approved'
      ) {
        router.replace('/agences/en-attente')
        return
      }

      /*
       * Une agence validée doit ensuite souscrire
       * à un abonnement PRO ou PREMIUM.
       *
       * Aucun plan gratuit n'existe dans notre système.
       */
      if (
        !hasActiveSubscription(
          profileData as Profile
        )
      ) {
        router.replace(
          '/dashboard-agence/abonnement'
        )
        return
      }

      const { data: listingsData } =
        await supabase
          .from('listings')
          .select(`
            id,
            title,
            price,
            zone_saisie,
            property_type,
            images_urls,
            is_boosted,
            boosted_until,
            created_at,
            whatsapp_clicks,
            views,
            is_active
          `)
          .eq('agent_id', user.id)
          .order('created_at', {
            ascending: false,
          })

      if (!mounted) return

      setProfile(profileData as Profile)

      setListings(
        (listingsData as Listing[]) ?? []
      )

      setLoading(false)
    }

    load()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  const handleDelete = async (
    id: string
  ) => {
    if (
      !confirm(
        'Supprimer cette annonce ?'
      )
    ) {
      return
    }

    const { error } =
      await supabase
        .from('listings')
        .delete()
        .eq('id', id)

    if (error) {
      console.error(
        'Erreur suppression annonce :',
        error
      )
      return
    }

    setListings((previous) =>
      previous.filter(
        (listing) =>
          listing.id !== id
      )
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  const totalClics = useMemo(
    () =>
      listings.reduce(
        (total, listing) =>
          total +
          (listing.whatsapp_clicks ?? 0),
        0
      ),
    [listings]
  )

  const totalVues = useMemo(
    () =>
      listings.reduce(
        (total, listing) =>
          total +
          (listing.views ?? 0),
        0
      ),
    [listings]
  )

  const annoncesActives = useMemo(
    () =>
      listings.filter(
        (listing) =>
          listing.is_active !== false
      ).length,
    [listings]
  )

  const annoncesBoost = useMemo(
    () =>
      listings.filter(
        (listing) =>
          listing.is_boosted
      ).length,
    [listings]
  )

  const counts = useMemo(
    () => ({
      tous: listings.length,

      actif: listings.filter(
        (listing) =>
          getStatut(listing) ===
          'actif'
      ).length,

      en_attente: listings.filter(
        (listing) =>
          getStatut(listing) ===
          'en_attente'
      ).length,

      expire: listings.filter(
        (listing) =>
          getStatut(listing) ===
          'expire'
      ).length,
    }),
    [listings]
  )

  const filtered = useMemo(() => {
    const query =
      search.trim().toLowerCase()

    return listings
      .filter(
        (listing) =>
          filter === 'tous' ||
          getStatut(listing) ===
            filter
      )
      .filter((listing) => {
        if (!query) {
          return true
        }

        return (
          listing.title
            .toLowerCase()
            .includes(query) ||
          listing.zone_saisie
            .toLowerCase()
            .includes(query)
        )
      })
  }, [
    listings,
    filter,
    search,
  ])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">
          Chargement...
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AgencySidebar
        profile={profile}
        isOpen={isSidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        onLogout={handleLogout}
      />

      {isSidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="flex flex-1 flex-col lg:pl-64">
        <AgencyTopbar
          agencyId={userId}
          onMenu={() =>
            setSidebarOpen(true)
          }
        />

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          <CockpitHero
            name={
              profile.full_name ?? ''
            }
            plan={profile.plan ?? 'pro'}
            listings={
              listings.length
            }
          />

          <StatsGrid
            listings={
              listings.length
            }
            views={totalVues}
            active={
              annoncesActives
            }
            whatsapp={
              totalClics
            }
            boosted={
              annoncesBoost
            }
          />

          <ListingsToolbar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            counts={counts}
            view={view}
            setView={setView}
          />

          <ListingsSection
            listings={filtered}
            view={view}
            getStatus={getStatut}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  )
}
