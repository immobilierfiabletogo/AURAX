'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '../utils/supabase' 
import { Bell } from 'lucide-react'

interface Notification {
  id: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`
  return `Il y a ${Math.floor(diff / 86400)}j`
}

export default function NotificationBell({ agencyId }: { agencyId: string }) {
  const supabase = createClient()
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unread = notifs.filter(n => !n.is_read).length

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false })
        .limit(20)
      setNotifs(data ?? [])
    }
    load()

    // Realtime — nouvelles notifications en temps réel
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `agency_id=eq.${agencyId}`
      }, (payload) => {
        setNotifs(prev => [payload.new as Notification, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [agencyId])

  // Fermer si clic extérieur
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('agency_id', agencyId)
      .eq('is_read', false)
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const typeIcon = (type: string) => {
    if (type === 'whatsapp_click') return '💬'
    if (type === 'view_milestone') return '👁️'
    return '🔔'
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open && unread > 0) markAllRead() }}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer">
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium">
                Aucune notification pour le moment
              </div>
            ) : notifs.map(n => (
              <div
                key={n.id}
                className={`flex gap-3 px-4 py-3 transition-colors ${!n.is_read ? 'bg-blue-50/40' : ''}`}
              >
                <span className="text-base shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}