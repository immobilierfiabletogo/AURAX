'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { ArrowLeft, Info } from 'lucide-react'

import { ListingClientService } from "@/lib/services/listing.client";

import ListingGallery from '@/components/listing/ListingGallery'
import ListingHeader from '@/components/listing/ListingHeader'
import ListingDescription from '@/components/listing/ListingDescription'
import ListingSidebar from '@/components/listing/ListingSidebar'
import ListingSecurity from '@/components/listing/ListingSecurity'
import SimilarListings from '@/components/listing/SimilarListings'
import ImageLightbox from '@/components/listing/ImageLightbox'

import type { Listing } from '@/types/listing'

interface Agency {
  id: string
  full_name: string
  phone_number: string | null
  avatar_url: string | null
  plan?: string | null
  website?: string | null
  verified?: boolean | null
}

export default function BienDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  const [activeImage, setActiveImage] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const [agence, setAgence] = useState<Agency | null>(null)
  const [similarListings, setSimilarListings] = useState<Listing[]>([])

  const openGallery = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const previousImage = () => {
    if (!listing?.images_urls?.length) return

    setLightboxIndex((current) =>
      current === 0
        ? listing.images_urls.length - 1
        : current - 1
    )
  }

  const nextImage = () => {
    if (!listing?.images_urls?.length) return

    setLightboxIndex((current) =>
      current === listing.images_urls.length - 1
        ? 0
        : current + 1
    )
  }

  useEffect(() => {
    if (!params?.id) return

    async function load() {
      setLoading(true)

      const data = await ListingClientService.getListingPage(
        params.id as string
      )

      if (!data) {
        setLoading(false)
        return
      }

      setListing(data.listing)
      setAgence(data.agency)
      setSimilarListings(data.similarListings)

      if (data.listing.images_urls?.length) {
        setActiveImage(data.listing.images_urls[0])
      }

      setLoading(false)
    }

    load()
  }, [params?.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Chargement...
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Info className="h-12 w-12 text-slate-300" />

        <h2 className="text-xl font-bold">
          Bien introuvable
        </h2>

        <Link
          href="/biens"
          className="rounded-xl bg-slate-900 px-5 py-3 text-white"
        >
          Retour au catalogue
        </Link>
      </div>
    )
  }

  const telephone =
    agence?.phone_number ??
    listing.contact_phone ??
    '+22879963708'

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold transition hover:border-emerald-500 hover:text-emerald-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>

            <span className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold">
              Réf. {listing.id.slice(0, 8)}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
          <div className="grid grid-cols-1 gap-8 lg:gap-10 xl:grid-cols-3">
            <div className="space-y-6 lg:space-y-8 xl:col-span-2">
              <ListingGallery
                images={listing.images_urls ?? []}
                title={listing.title}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
                isBoosted={listing.is_boosted}
                transactionType={listing.transaction_type}
                onOpenGallery={openGallery}
              />

              <ListingHeader
                title={listing.title}
                price={listing.price}
                propertyType={listing.property_type}
                transactionType={listing.transaction_type}
                zone={listing.zone_saisie}
                createdAt={listing.created_at}
                views={listing.views ?? undefined}
              />

              <ListingDescription
                description={
                  listing.description ??
                  'Aucune description disponible pour ce bien.'
                }
                propertyType={listing.property_type}
                transactionType={listing.transaction_type}
              />

              <ListingSecurity />
            </div>

            <div className="w-full xl:max-w-[390px] xl:justify-self-end">
              <ListingSidebar
  listingId={listing.id}
  title={listing.title}
  phone={telephone}
  price={listing.price}
  zone={listing.zone_saisie}
  transactionType={listing.transaction_type}
  agencyId={agence?.id}
  agencyName={agence?.full_name}
  agencyAvatar={agence?.avatar_url}
  agencyPlan={agence?.plan}
  agencyVerified={agence?.verified ?? undefined}
/>
            </div>
          </div>

          <div className="mt-12 lg:mt-20">
            <SimilarListings
              listings={similarListings}
            />
          </div>
        </main>
      </div>

      <ImageLightbox
        images={listing.images_urls ?? []}
        currentIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={previousImage}
        onNext={nextImage}
      />
    </>
  )
}