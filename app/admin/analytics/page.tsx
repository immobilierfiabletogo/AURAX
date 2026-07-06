'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import { Users, Home, Eye, MessageSquare, TrendingUp, Building2 } from 'lucide-react'

// Constante alignée sur ton fichier admin principal
const ADMIN_EMAIL = 'djaglijosephbenoit@gmail.com'

export default function AnalyticsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListings: 0,
    approvedListings: 0,
    pendingListings: 0,
    totalAgences: 0,
    totalParticuliers: 0,
    totalVues: 0,
    totalClicsWhatsapp: 0,
    newListingsToday: 0,
    newUsersToday: 0,
  })
  const [topBiens, setTopBiens] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Verification stricte et rapide par email
      if (!user || user.email !== ADMIN_EMAIL) { 
        router.push('/')
        return 
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [
        { count: totalListings },
        { count: approvedListings },
        { count: pendingListings },
        { count: totalAgences },
        { count: totalParticuliers },
        { data: vuesData },
        { count: newListingsToday },
        { count: newUsersToday },
        { data: topBiensData },
      ] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'agence'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'particulier'),
        supabase.from('listings').select('views, whatsapp_clicks'),
        supabase.from('listings').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        supabase.from('listings').select('id, title, zone_saisie, views, whatsapp_clicks, images_urls').eq('status', 'approved').order('views', { ascending: false }).limit(5),
      ])

      const totalVues = vuesData?.reduce((acc, l) => acc + (l.views ?? 0), 0) ?? 0
      const totalClicsWhatsapp = vuesData?.reduce((acc, l) => acc + (l.whatsapp_clicks ?? 0), 0) ?? 0

      setStats({
        totalListings: totalListings ?? 0,
        approvedListings: approvedListings ?? 0,
        pendingListings: pendingListings ?? 0,
        totalAgences: totalAgences ?? 0,
        totalParticuliers: totalParticuliers ?? 0,
        totalVues,
        totalClicsWhatsapp,
        newListingsToday: newListingsToday ?? 0,
        newUsersToday: newUsersToday ?? 0,
      })
      setTopBiens(topBiensData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center text-sm text-slate-400 animate-pulse">
      Chargement des analytics...
    </div>
  )

  const statCards = [
    { label: 'Annonces totales', value: stats.totalListings, icon: Home, color: 'text-slate-900' },
    { label: 'Annonces approuvées', value: stats.approvedListings, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'En attente modération', value: stats.pendingListings, icon: Home, color: 'text-amber-600' },
    { label: 'Agences inscrites', value: stats.totalAgences, icon: Building2, color: 'text-blue-600' },
    { label: 'Particuliers inscrits', value: stats.totalParticuliers, icon: Users, color: 'text-purple-600' },
    { label: 'Vues totales annonces', value: stats.totalVues, icon: Eye, color: 'text-slate-900' },
    { label: 'Clics WhatsApp totaux', value: stats.totalClicsWhatsapp, icon: MessageSquare, color: 'text-emerald-600' },
    { label: 'Nouvelles annonces aujourd\'hui', value: stats.newListingsToday, icon: TrendingUp, color: 'text-amber-600' },
    { label: 'Nouveaux inscrits aujourd\'hui', value: stats.newUsersToday, icon: Users, color: 'text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/60 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-950">Analytics AURAX</h1>
          <p className="text-sm text-slate-500 mt-1">Vue d'ensemble de la plateforme en temps réel</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</span>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className={`text-3xl font-black font-mono ${s.color}`}>{s.value}</div>
              </div>
            )
          })}
        </div>

        {/* Top 5 biens les plus vus */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">
            Top 5 — Annonces les plus vues
          </h2>
          <div className="space-y-3">
            {topBiens.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Aucune donnée disponible</p>
            ) : topBiens.map((b, i) => (
              <div key={b.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <span className="text-lg font-black font-mono text-slate-300 w-6">#{i + 1}</span>
                <div className="h-10 w-14 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                  {b.images_urls?.[0] && <img src={b.images_urls[0]} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{b.title}</p>
                  <p className="text-xs text-slate-400">{b.zone_saisie}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <div className="text-sm font-black font-mono text-slate-900">{b.views ?? 0}</div>
                    <div className="text-[10px] text-slate-400">vues</div>
                  </div>
                  <div>
                    <div className="text-sm font-black font-mono text-emerald-600">{b.whatsapp_clicks ?? 0}</div>
                    <div className="text-[10px] text-slate-400">clics WA</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}