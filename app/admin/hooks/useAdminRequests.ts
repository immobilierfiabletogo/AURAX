'use client'

import { useCallback, useEffect, useState } from 'react'

import { createClient } from "@/lib/supabase/client";
import type { Tables } from '@/types/database'

type Request = Tables<'requests'>

interface UseAdminRequestsReturn {
  requests: Request[]
  loading: boolean
  refresh: () => Promise<void>
  toggleActive: (
    requestId: string,
    currentValue: boolean
  ) => Promise<void>
  deleteRequest: (
    requestId: string
  ) => Promise<void>
}

export default function useAdminRequests(): UseAdminRequestsReturn {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)

    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', {
          ascending: false,
        })

      if (error) throw error

      setRequests((data ?? []) as Request[])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function toggleActive(
    requestId: string,
    currentValue: boolean
  ) {
    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from('requests')
        .update({
          is_active: !currentValue,
        })
        .eq('id', requestId)

      if (error) throw error

      await refresh()
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteRequest(
    requestId: string
  ) {
    const confirmed = window.confirm(
      'Supprimer définitivement cette demande ?'
    )

    if (!confirmed) return

    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', requestId)

      if (error) throw error

      await refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    requests,
    loading,
    refresh,
    toggleActive,
    deleteRequest,
  }
}