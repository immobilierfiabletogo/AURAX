import { createClient } from '@/utils/supabase'
import type { Tables } from '@/types/database'

import {
  calculateMatchScore,
  type MatchResult,
} from './calculateMatchScore'

type Request = Tables<'requests'>
type Profile = Tables<'profiles'>
type Listing = Tables<'listings'>

export interface AgencyMatch extends MatchResult {
  agency: Profile
}

export async function findMatchingAgencies(
  request: Request,
  limit = 5
): Promise<AgencyMatch[]> {
  const supabase = await createClient()

  const { data: agencies, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'agence')

  if (error) throw error

  if (!agencies?.length) {
    return []
  }

  const results: AgencyMatch[] = []

  for (const agency of agencies as Profile[]) {
    const { data: listings } = await supabase
      .from('listings')
      .select('*')
      .eq('agent_id', agency.id)
      .eq('is_active', true)

    const match = calculateMatchScore({
      request,
      agency,
      listings: (listings ?? []) as Listing[],
    })

    if (match.score > 0) {
      results.push({
        agency,
        score: match.score,
        reasons: match.reasons,
      })
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}