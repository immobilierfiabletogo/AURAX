import { createClient } from '@/utils/supabase'
import type { Tables } from '@/types/database'

import { findMatchingAgencies } from './findMatchingAgencies'

type Request = Tables<'requests'>

export interface MatchingEngineResult {
  distributed: number
  agencies: {
    agencyId: string
    score: number
  }[]
}

export async function runMatchingEngine(
  request: Request
): Promise<MatchingEngineResult> {
  const supabase = await createClient()

  const matches = await findMatchingAgencies(
    request,
    5
  )

  const agencies: MatchingEngineResult['agencies'] = []

  for (const match of matches) {
    const { error } = await supabase
      .from('request_matches')
      .insert({
        request_id: request.id,
        agency_id: match.agency.id,
        score: match.score,
        status: 'pending',
      })

    if (error) {
      console.error(
        'Erreur request_matches :',
        error
      )
      continue
    }

    agencies.push({
      agencyId: match.agency.id,
      score: match.score,
    })
  }

  return {
    distributed: agencies.length,
    agencies,
  }
}