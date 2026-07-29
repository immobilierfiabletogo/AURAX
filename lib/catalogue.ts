import { createClient } from '@/utils/supabase'
import type { Listing, CatalogueFilters } from '@/types/listing'

const ITEMS_PER_PAGE = 12

export const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')


export async function fetchListings(filters: CatalogueFilters): Promise<{
  data: Listing[]
  count: number
  totalPages: number
}> {

  const supabase = createClient()

  const {
    zone,
    type,
    transaction,
    budget,
    sort,
    page,
  } = filters


  const currentPage = page ?? 1

  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1


  let query = supabase
    .from('listings')
    .select(
      `
      id,
      title,
      price,
      zone_saisie,
      property_type,
      transaction_type,
      images_urls,
      is_boosted,
      created_at,
      views
      `,
      {
        count: 'exact'
      }
    )
    .eq('is_active', true)
    .range(from, to)



  // Recherche zone

  if (zone) {
    query = query.ilike(
      'zone_normalized',
      `%${normalize(zone)}%`
    )
  }



  // Type de bien

  if (type) {
    query = query.eq(
      'property_type',
      type
    )
  }



  // Location / Vente

  if (transaction) {
    query = query.eq(
      'transaction_type',
      transaction
    )
  }




  // ============================
  // FILTRE BUDGET
  // ============================

  if (budget && transaction) {


    // -------- LOCATION --------

    if (transaction === 'location') {

      switch (budget) {


        case 'petit':

          query = query.lt(
            'price',
            150000
          )

          break



        case 'moyen':

          query = query
            .gte(
              'price',
              150000
            )
            .lt(
              'price',
              500000
            )

          break



        case 'grand':

          query = query
            .gte(
              'price',
              500000
            )
            .lt(
              'price',
              1500000
            )

          break



        case 'luxe':

          query = query.gte(
            'price',
            1500000
          )

          break

      }

    }



    // -------- VENTE --------

    if (transaction === 'vente') {


      switch (budget) {


        case 'petit':

          query = query.lt(
            'price',
            25000000
          )

          break



        case 'moyen':

          query = query
            .gte(
              'price',
              25000000
            )
            .lt(
              'price',
              100000000
            )

          break



        case 'grand':

          query = query
            .gte(
              'price',
              100000000
            )
            .lt(
              'price',
              500000000
            )

          break



        case 'luxe':

          query = query.gte(
            'price',
            500000000
          )

          break

      }

    }

  }





  // ============================
  // TRI
  // ============================

  switch (sort) {


    case 'price_asc':

      query = query.order(
        'price',
        {
          ascending: true
        }
      )

      break



    case 'price_desc':

      query = query.order(
        'price',
        {
          ascending: false
        }
      )

      break



    case 'views':

      query = query.order(
        'views',
        {
          ascending: false
        }
      )

      break



    default:

      query = query
        .order(
          'is_boosted',
          {
            ascending: false
          }
        )
        .order(
          'created_at',
          {
            ascending: false
          }
        )

  }



  const {
    data,
    count,
  } = await query



  return {

    data:
      (data as Listing[]) ?? [],

    count:
      count ?? 0,

    totalPages:
      Math.ceil(
        (count ?? 0) / ITEMS_PER_PAGE
      ),

  }

}

export async function fetchSimilarListings(
  listing: Listing
): Promise<Listing[]> {

  const supabase = createClient()

  const minPrice = listing.price * 0.7
  const maxPrice = listing.price * 1.3

  const { data } = await supabase
    .from('listings')
    .select(
      'id, title, price, zone_saisie, property_type, transaction_type, images_urls, is_boosted, created_at, views'
    )
    .eq('is_active', true)
    .eq('property_type', listing.property_type)
    .eq('transaction_type', listing.transaction_type)
    .neq('id', listing.id)
    .gte('price', minPrice)
    .lte('price', maxPrice)
    .limit(4)

  return (data as Listing[]) ?? []
}