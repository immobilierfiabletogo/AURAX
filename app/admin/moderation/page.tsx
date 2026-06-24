'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { CheckCircle2, XCircle, MapPin } from 'lucide-react'

export default function ModerationPage() {
  const supabase = createClient()
  const [pending, setPending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('listings')
        .select('id, title, description, price, zone_saisie, property_type, images_urls, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
      setPending(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('listings').update({ status }).eq('id', id)
    setPending(prev => prev.filter(l => l.id !== id))
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Chargement...</div>

  return (
    <div className="min-h-screen bg-slate-50/60 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-black text-slate-950 mb-1">Modération des annonces</h1>
        <p className="text-sm text-slate-500 mb-6">{pending.length} annonce(s) en attente de validation</p>

        {pending.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
            Aucune annonce en attente.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4">
                <div className="h-20 w-28 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {l.images_urls?.[0] && <img src={l.images_urls[0]} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">{l.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{l.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {l.zone_saisie}</span>
                    <span>{l.property_type}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => handleAction(l.id, 'approved')} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approuver
                  </button>
                  <button onClick={() => handleAction(l.id, 'rejected')} className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl">
                    <XCircle className="w-3.5 h-3.5" /> Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}