'use client'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { createClient } from '@/lib/supabase/client'

import {
  approveAgencyAction,
  rejectAgencyAction,
} from '../actions/moderation'

export interface PendingAgency {
  id: string
  full_name: string
  phone_number: string
  created_at: string

  verification_status: string | null
  verified: boolean | null

  avatar_url: string | null
  website: string | null
  adresse: string | null
}

const supabase = createClient()

export function useModeration(
  showToast: (
    message: string,
    type?: 'success' | 'error'
  ) => void
) {
  const [loading, setLoading] = useState(true)
  const [agencies, setAgencies] =
    useState<PendingAgency[]>([])

  const loadPending = useCallback(
    async (initial = false) => {
      if (initial) {
        setLoading(true)
      }

      const {
        data,
        error,
      } = await supabase
        .from('profiles')
        .select(
          `
            id,
            full_name,
            phone_number,
            created_at,
            avatar_url,
            website,
            adresse,
            verification_status,
            verified
          `
        )
        .eq('user_type', 'agence')
        .eq(
          'verification_status',
          'pending'
        )
        .order('created_at', {
          ascending: false,
        })

      if (error) {
        console.error(
          'Erreur lors du chargement des agences en attente :',
          error
        )

        showToast(
          'Impossible de charger les agences en attente.',
          'error'
        )

        if (initial) {
          setAgencies([])
        }
      } else {
        setAgencies(
          (data ?? []) as PendingAgency[]
        )
      }

      if (initial) {
        setLoading(false)
      }
    },
    [showToast]
  )

  /*
   * APPROUVER
   */
  const approve = useCallback(
    async (id: string) => {
      const result =
        await approveAgencyAction(id)

      if (result.error) {
        showToast(
          result.error.message,
          'error'
        )
        return
      }

      /*
       * Mise à jour optimiste :
       * on retire immédiatement l'agence
       * de la liste sans afficher de loader.
       */
      setAgencies((current) =>
        current.filter(
          (agency) => agency.id !== id
        )
      )

      showToast(
        'Agence approuvée avec succès.',
        'success'
      )
    },
    [showToast]
  )

  /*
   * REFUSER
   */
  const reject = useCallback(
    async (id: string) => {
      const result =
        await rejectAgencyAction(id)

      if (result.error) {
        showToast(
          result.error.message,
          'error'
        )
        return
      }

      setAgencies((current) =>
        current.filter(
          (agency) => agency.id !== id
        )
      )

      showToast(
        'Agence refusée.',
        'success'
      )
    },
    [showToast]
  )

  /*
   * CHARGEMENT INITIAL + REALTIME
   */
  useEffect(() => {
    void loadPending(true)

    const channel = supabase
      .channel('moderation-agencies')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          /*
           * Nouvelle agence
           */
          if (
            payload.eventType === 'INSERT'
          ) {
            const profile =
              payload.new as {
                id?: string
                user_type?: string | null
                verification_status?: string | null
              }

            if (
              profile.user_type ===
                'agence' &&
              profile.verification_status ===
                'pending'
            ) {
              void loadPending(false)
            }

            return
          }

          /*
           * Modification d'une agence
           */
          if (
            payload.eventType === 'UPDATE'
          ) {
            const oldProfile =
              payload.old as {
                id?: string
                user_type?: string | null
                verification_status?: string | null
              }

            const newProfile =
              payload.new as {
                id?: string
                user_type?: string | null
                verification_status?: string | null
              }

            const wasPending =
              oldProfile.user_type ===
                'agence' &&
              oldProfile.verification_status ===
                'pending'

            const isPending =
              newProfile.user_type ===
                'agence' &&
              newProfile.verification_status ===
                'pending'

            /*
             * L'agence entre ou sort de la
             * file d'attente.
             */
            if (
              wasPending !== isPending
            ) {
              void loadPending(false)
            }

            return
          }

          /*
           * Suppression d'un profil
           */
          if (
            payload.eventType === 'DELETE'
          ) {
            const oldProfile =
              payload.old as {
                id?: string
              }

            if (oldProfile.id) {
              setAgencies((current) =>
                current.filter(
                  (agency) =>
                    agency.id !==
                    oldProfile.id
                )
              )
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadPending])

  return {
    loading,
    agencies,
    approve,
    reject,
    reload: () => loadPending(false),
  }
}