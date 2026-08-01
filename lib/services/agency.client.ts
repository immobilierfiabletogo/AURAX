import { createClient } from '@/lib/supabase/client'

const PAGE_SIZE = 12

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export class AgencyClientService {
  static async getCatalog(
    page: number,
    search: string
  ) {
    const supabase = createClient()

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('profiles')
      .select(
        `
          id,
          full_name,
          avatar_url,
          cover_url,
          description,
          adresse,
          website,
          phone_number,
          plan,
          verified,
          created_at
        `,
        {
          count: 'exact',
        }
      )
      .eq('user_type', 'agence')
      .order('verified', {
        ascending: false,
      })
      .order('plan', {
        ascending: false,
      })
      .order('created_at', {
        ascending: false,
      })
      .range(from, to)

    if (search.trim()) {
      const value = normalize(search)

      query = query.or(
        `full_name.ilike.%${value}%,adresse.ilike.%${value}%`
      )
    }

    const { data, count, error } = await query

    if (error) {
      throw error
    }

    const agencies = await Promise.all(
      (data ?? []).map(async (agency) => {
        const { count: listingsCount } = await supabase
          .from('listings')
          .select('*', {
            head: true,
            count: 'exact',
          })
          .eq('agent_id', agency.id)
          .eq('is_active', true)
          .eq('status', 'approved')

        return {
          ...agency,
          listings_count: listingsCount ?? 0,
        }
      })
    )

    return {
      agencies,
      total: count ?? 0,
      hasMore:
        from + agencies.length < (count ?? 0),
    }
  }

  static async getAgency(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
          id,
          full_name,
          avatar_url,
          cover_url,
          description,
          adresse,
          website,
          phone_number,
          plan,
          verified,
          created_at
        `
      )
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    const { count } = await supabase
      .from('listings')
      .select('*', {
        head: true,
        count: 'exact',
      })
      .eq('agent_id', id)
      .eq('is_active', true)
      .eq('status', 'approved')

    return {
      ...data,
      listings_count: count ?? 0,
    }
  }
}