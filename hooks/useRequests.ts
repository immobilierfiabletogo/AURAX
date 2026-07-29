'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { RequestClientService } from '@/lib/services/request.client'
import type { Tables } from '@/types/database'

type Request = Tables<'requests'>

export default function useRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const loadRequests = useCallback(async () => {
    setLoading(true)

    try {
      const data =
        await RequestClientService.getRequests()

      setRequests(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRequests()
  }, [loadRequests])

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch =
        search.trim() === '' ||
        request.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        request.quartier
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        request.type
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesType =
        type === '' ||
        request.type === type

      return matchesSearch && matchesType
    })
  }, [requests, search, type])

  return {
    loading,

    requests: filteredRequests,
    total: requests.length,

    search,
    setSearch,

    type,
    setType,

    refresh: loadRequests,
  }
}