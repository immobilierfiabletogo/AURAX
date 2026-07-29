'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { useCatalogue } from '@/hooks/useCatalogue'
import SearchFilters from '@/components/catalogue/SearchFilters'
import PropertyGrid from '@/components/catalogue/PropertyGrid'
import Pagination from '@/components/catalogue/Pagination'
import { createClient } from "@/lib/supabase/client";


function CatalogueContent() {

  const router = useRouter()


  const {
    listings,
    total,
    totalPages,
    loading,
    page,

    type,
    transaction,
    budget,
    sort,

    zoneInput,
    setZoneInput,

    hasActiveFilters,

    setParam,
    clearAll,

  } = useCatalogue()



  const handleBack = () => {

    if (window.history.length > 1) {

      router.back()

    } else {

      router.push('/')

    }

  }



  return (

    <div
      className="
        min-h-screen
        bg-[#f7f7f5]
        text-slate-900
        antialiased
      "
    >

       

       
      {/* Navigation catalogue sticky */}
      <div
        className="
          sticky
          top-16
          z-50
          bg-[#f7f7f5]/90
          backdrop-blur-md
          border-b
          border-slate-100
        "
      >
        <div className="mx-auto max-w-7xl px-4 py-3">

          <button
            onClick={handleBack}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-white
              border
              border-slate-200
              px-4
              py-2
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              transition-all
              hover:border-emerald-500
              hover:bg-emerald-50
              hover:text-emerald-600
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

        </div>
      </div>





      {/* Recherche + filtres */}

      <SearchFilters

        zoneInput={zoneInput}

        setZoneInput={setZoneInput}


        transaction={transaction}

        type={type}

        budget={budget}

        sort={sort}


        total={total}

        hasActiveFilters={
          hasActiveFilters
        }


        onSetParam={
          setParam
        }


        onClearAll={
          clearAll
        }

      />





      {/* Résultats */}

      <main
        className="
          mx-auto
          max-w-7xl
          px-4
          py-6
        "
      >


        <PropertyGrid

          listings={listings}

          loading={loading}

          hasActiveFilters={
            hasActiveFilters
          }

          onClearFilters={
            clearAll
          }

        />





        {
          !loading &&
          totalPages > 1 && (

            <div
              className="
                mt-10
                flex
                justify-center
              "
            >

              <Pagination

                currentPage={page}

                totalPages={totalPages}

              />

            </div>

          )
        }


      </main>


    </div>

  )

}




export default function BiensPage() {

  return (

    <Suspense

      fallback={

        <div
          className="
            min-h-screen
            bg-slate-50
            flex
            items-center
            justify-center
          "
        >

          <div
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.3em]
              text-slate-400
              animate-pulse
            "
          >

            Chargement...

          </div>


        </div>

      }

    >

      <CatalogueContent />

    </Suspense>

  )

}