'use client'

import {
  MapPin,
  Navigation,
} from 'lucide-react'


interface Props {
  zone: string
  latitude?: number
  longitude?: number
}


export default function ListingMap({
  zone,
  latitude,
  longitude,
}: Props) {


  const hasCoordinates =
    latitude !== undefined &&
    longitude !== undefined



  return (

    <section
      className="
        space-y-5
      "
    >

      <h2
        className="
          text-2xl
          font-black
          text-slate-900
        "
      >
        Localisation
      </h2>



      <div
        className="
          relative
          flex
          h-[320px]
          items-center
          justify-center
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-slate-100
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            text-center
          "
        >

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-emerald-100
            "
          >

            <MapPin
              className="
                h-8
                w-8
                text-emerald-600
              "
            />

          </div>



          <div>

            <p
              className="
                font-black
                text-slate-900
              "
            >
              {zone}
            </p>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Localisation approximative
            </p>

          </div>


        </div>



        {
          hasCoordinates && (

            <a
              href={
                `https://www.google.com/maps?q=${latitude},${longitude}`
              }
              target="_blank"
              className="
                absolute
                bottom-5
                right-5
                flex
                items-center
                gap-2
                rounded-2xl
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-slate-700
                shadow-lg
                transition
                hover:scale-105
              "
            >

              <Navigation
                className="
                  h-4
                  w-4
                "
              />

              Ouvrir la carte

            </a>

          )
        }


      </div>


    </section>

  )
}