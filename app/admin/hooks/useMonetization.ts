'use client'

import { useState } from 'react'
import { createClient } from "@/lib/supabase/client";

export function useMonetization(showToast: (text: string, type?: 'success' | 'error') => void) {
  const supabase = createClient()
  const [monetizationEnabled, setMonetizationEnabled] = useState(false)
  const [loadingToggle, setLoadingToggle] = useState(false)

  const loadMonetization = async () => {
    const { data } = await supabase
      .from('app_settings')
      .select('monetization_enabled')
      .eq('id', 1)
      .single()
    if (data) setMonetizationEnabled(data.monetization_enabled)
  }

  const toggleMonetization = async () => {
    const next = !monetizationEnabled
    const msg = next
      ? 'Activer la monétisation ?'
      : 'Désactiver la monétisation ?'
    if (!confirm(msg)) return
    setLoadingToggle(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('app_settings')
        .update({
          monetization_enabled: next,
          monetization_activated_at: next ? new Date().toISOString() : null,
          monetization_activated_by: next ? user?.id : null,
        })
        .eq('id', 1)
      if (error) throw error
      setMonetizationEnabled(next)
      showToast(next ? '🚀 Monétisation ACTIVÉE' : 'Monétisation désactivée')
    } catch { showToast('Erreur', 'error') }
    finally { setLoadingToggle(false) }
  }

  return { monetizationEnabled, loadingToggle, loadMonetization, toggleMonetization }
}