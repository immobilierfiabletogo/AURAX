import type { Tables } from '@/types/database'

type Request = Tables<'requests'>
type Profile = Tables<'profiles'>
type Listing = Tables<'listings'>

interface MatchInput {
  request: Request
  agency: Profile
  listings: Listing[]
}

export interface MatchResult {
  score: number
  reasons: string[]
}

export function calculateMatchScore({
  request,
  agency,
  listings,
}: MatchInput): MatchResult {
  let score = 0
  const reasons: string[] = []

  // ---------- Type de bien ----------

  const matchingType = listings.filter(
    (listing) =>
      listing.property_type === request.type
  )

  if (matchingType.length > 0) {
    score += 35
    reasons.push('Type de bien correspondant')
  }

  // ---------- Localisation ----------

  const matchingLocation = listings.filter(
    (listing) =>
      listing.zone_saisie &&
      request.quartier &&
      listing.zone_saisie
        .toLowerCase()
        .includes(request.quartier.toLowerCase())
  )

  if (matchingLocation.length > 0) {
    score += 25
    reasons.push('Même zone géographique')
  }

  // ---------- Budget ----------

  if (request.budget) {
    const budgetMatches = listings.filter((listing) => {
      const delta = Math.abs(
        listing.price - request.budget!
      )

      return delta <= request.budget! * 0.20
    })

    if (budgetMatches.length > 0) {
      score += 20
      reasons.push('Budget compatible')
    }
  }

  // ---------- Activité récente ----------

  if (listings.length >= 5) {
    score += 10
    reasons.push('Agence active')
  }

  // ---------- Abonnement ----------

  switch (agency.plan) {
    case 'premium':
      score += 10
      reasons.push('Agence Premium')
      break

    case 'pro':
      score += 5
      reasons.push('Agence Pro')
      break

    default:
      break
  }

  return {
    score: Math.min(score, 100),
    reasons,
  }
}