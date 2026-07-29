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
  if (!listing.boosted_until) return 'en_attente'

  return new Date(listing.boosted_until) > new Date()
    ? 'actif'
    : 'expire'
}

export default function DashboardAgencePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)

  const [userId, setUserId] = useState('')

  const [profile, setProfile] = useState<any>(null)

  const [listings, setListings] = useState<Listing[]>([])

  const [search, setSearch] = useState('')

  const [filter, setFilter] = useState<
    'tous' | 'actif' | 'en_attente' | 'expire'
  >('tous')

  const [view, setView] = useState<'liste' | 'grille'>('liste')

  const [isSidebarOpen, setSidebarOpen] =
    useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      const [
        { data: profileData },
        { data: listingsData },
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select(`
            full_name,
            user_type,
            plan,
            plan_expires_at,
            phone_number,
            avatar_url
          `)
          .eq('id', user.id)
          .single(),

        supabase
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
          }),
      ])

      if (profileData?.user_type !== 'agence') {
        router.push('/dashboard-agence')
        return
      }

      setProfile(profileData)
      setListings((listingsData as Listing[]) ?? [])
      setLoading(false)
    }

    load()
  }, [router, supabase])

    const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return

    await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    setListings((previous) =>
      previous.filter(
        (listing) => listing.id !== id
      )
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const nom = profile?.full_name ?? ''

  const totalClics = useMemo(
    () =>
      listings.reduce(
        (total, listing) =>
          total + (listing.whatsapp_clicks ?? 0),
        0
      ),
    [listings]
  )

  const totalVues = useMemo(
    () =>
      listings.reduce(
        (total, listing) =>
          total + (listing.views ?? 0),
        0
      ),
    [listings]
  )

  const annoncesActives = useMemo(
    () =>
      listings.filter(
        (listing) => listing.is_active !== false
      ).length,
    [listings]
  )

  const annoncesBoost = useMemo(
    () =>
      listings.filter(
        (listing) => listing.is_boosted
      ).length,
    [listings]
  )

  const counts = useMemo(
    () => ({
      tous: listings.length,

      actif: listings.filter(
        (listing) =>
          getStatut(listing) === 'actif'
      ).length,

      en_attente: listings.filter(
        (listing) =>
          getStatut(listing) ===
          'en_attente'
      ).length,

      expire: listings.filter(
        (listing) =>
          getStatut(listing) === 'expire'
      ).length,
    }),
    [listings]
  )

  const filtered = useMemo(() => {
    return listings
      .filter(
        (listing) =>
          filter === 'tous' ||
          getStatut(listing) === filter
      )
      .filter((listing) => {
        const q = search.toLowerCase()

        return (
          listing.title
            .toLowerCase()
            .includes(q) ||
          listing.zone_saisie
            .toLowerCase()
            .includes(q)
        )
      })
  }, [listings, filter, search])

 if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      Chargement...
    </div>
  )
}

return (
  <div className="flex min-h-screen bg-slate-50 text-slate-900">

    <AgencySidebar
      profile={profile}
      isOpen={isSidebarOpen}
      onClose={() => setSidebarOpen(false)}
      onLogout={handleLogout}
    />

    {isSidebarOpen && (
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
      />
    )}

    <div className="flex flex-1 flex-col lg:pl-64">

      <AgencyTopbar
        agencyId={userId}
        onMenu={() => setSidebarOpen(true)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">

        <CockpitHero
          name={profile?.full_name ?? ''}
          plan={profile?.plan ?? 'gratuit'}
          listings={listings.length}
        />

        <StatsGrid
          listings={listings.length}
          views={totalVues}
          active={annoncesActives}
          whatsapp={totalClics}
          boosted={annoncesBoost}
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