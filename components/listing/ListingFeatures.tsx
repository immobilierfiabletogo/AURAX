'use client'

import {
  Bath,
  BedDouble,
  Building2,
  Maximize,
  ParkingCircle,
  Ruler,
} from 'lucide-react'


interface Props {
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  surface?: number
  landSurface?: number
  parking?: number
}


export default function ListingFeatures({
  propertyType,
  bedrooms,
  bathrooms,
  surface,
  landSurface,
  parking,
}: Props) {


  const features = [
    {
      icon: Building2,
      label: 'Type',
      value: propertyType,
    },

    bedrooms !== undefined && {
      icon: BedDouble,
      label: 'Chambres',
      value: bedrooms,
    },

    bathrooms !== undefined && {
      icon: Bath,
      label: 'Salles de bain',
      value: bathrooms,
    },

    surface !== undefined && {
      icon: Maximize,
      label: 'Surface habitable',
      value: `${surface} m²`,
    },

    landSurface !== undefined && {
      icon: Ruler,
      label: 'Terrain',
      value: `${landSurface} m²`,
    },

    parking !== undefined && {
      icon: ParkingCircle,
      label: 'Parking',
      value: parking,
    },

  ].filter(Boolean)



  if (features.length === 0) {
    return null
  }


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
        Caractéristiques
      </h2>


      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >

        {features.map(
          (
            feature: any,
            index
          ) => {

            const Icon =
              feature.icon


            return (

              <div
                key={index}
                className="
                  flex
                  items-center
                  gap-4
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100
                  "
                >

                  <Icon
                    className="
                      h-6
                      w-6
                      text-slate-700
                    "
                  />

                </div>



                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      text-slate-400
                    "
                  >
                    {feature.label}
                  </p>


                  <p
                    className="
                      font-black
                      text-slate-900
                    "
                  >
                    {feature.value}
                  </p>

                </div>


              </div>

            )

          }
        )}

      </div>


    </section>

  )
}