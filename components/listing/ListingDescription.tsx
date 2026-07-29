'use client'

import {
  FileText,
  Home,
  Tag,
  HandCoins,
} from 'lucide-react'

interface Props {
  description: string
  propertyType: string
  transactionType: string
}

export default function ListingDescription({
  description,
  propertyType,
  transactionType,
}: Props) {
  return (
    <section className="space-y-8">

      {/* Description */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            border-b
            border-slate-100
            px-6
            py-5
            sm:px-8
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-emerald-50
              "
            >
              <FileText className="h-7 w-7 text-emerald-600" />
            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-black
                  text-slate-900
                "
              >
                Description
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Toutes les informations communiquées par le propriétaire.
              </p>

            </div>

          </div>

        </div>

        <div className="px-6 py-8 sm:px-8">

          <div
  className="
    prose
    prose-slate
    max-w-none

    prose-headings:font-black
    prose-headings:text-slate-900

    prose-p:leading-8
    prose-p:text-slate-700

    prose-strong:text-slate-900

    prose-a:text-emerald-600
    prose-a:no-underline
    hover:prose-a:underline

    prose-ul:list-disc
    prose-ol:list-decimal

    prose-blockquote:border-emerald-500
    prose-blockquote:bg-emerald-50
    prose-blockquote:px-4
    prose-blockquote:py-2
  "
  dangerouslySetInnerHTML={{
    __html: description,
  }}
/>

        </div>

      </div>

      {/* Caractéristiques */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          sm:p-8
        "
      >

        <div className="mb-8">

          <h2
            className="
              text-2xl
              font-black
              text-slate-900
            "
          >
            Caractéristiques
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Informations essentielles concernant ce bien.
          </p>

        </div>

        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-emerald-200
              hover:bg-white
              hover:shadow-lg
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                "
              >
                <Home className="h-6 w-6 text-blue-600" />
              </div>

              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Type de bien
                </p>

                <p
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {propertyType}
                </p>

              </div>

            </div>

          </div>

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-emerald-200
              hover:bg-white
              hover:shadow-lg
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100
                "
              >
                <HandCoins className="h-6 w-6 text-emerald-600" />
              </div>

              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Transaction
                </p>

                <p
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {transactionType === 'location'
                    ? 'Location'
                    : 'Vente'}
                </p>

              </div>

            </div>

          </div>

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-emerald-200
              hover:bg-white
              hover:shadow-lg
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-amber-100
                "
              >
                <Tag className="h-6 w-6 text-amber-600" />
              </div>

              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Catégorie
                </p>

                <p
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  Immobilier
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}