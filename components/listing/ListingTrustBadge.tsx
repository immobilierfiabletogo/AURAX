'use client'

import {
  BadgeCheck,
  Crown,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react'


interface Props {
  verified?: boolean
  fastResponse?: boolean
  premium?: boolean
  trending?: boolean
  secure?: boolean
}


export default function ListingTrustBadge({
  verified = false,
  fastResponse = false,
  premium = false,
  trending = false,
  secure = false,
}: Props) {


  const badges = [

    verified && {
      label: 'Vérifié AURAX',
      icon: BadgeCheck,
      className:
        'bg-emerald-50 text-emerald-700 border-emerald-200',
    },


    fastResponse && {
      label: 'Réponse rapide',
      icon: Zap,
      className:
        'bg-blue-50 text-blue-700 border-blue-200',
    },


    secure && {
      label: 'Transaction sécurisée',
      icon: ShieldCheck,
      className:
        'bg-slate-50 text-slate-700 border-slate-200',
    },


    premium && {
      label: 'Premium',
      icon: Crown,
      className:
        'bg-amber-50 text-amber-700 border-amber-200',
    },


    trending && {
      label: 'Très demandé',
      icon: TrendingUp,
      className:
        'bg-purple-50 text-purple-700 border-purple-200',
    },


  ].filter(Boolean)



  if (badges.length === 0) {
    return null
  }



  return (

    <div
      className="
        flex
        flex-wrap
        gap-2
      "
    >

      {
        badges.map(
          (
            badge: any,
            index
          ) => {

            const Icon =
              badge.icon


            return (

              <div
                key={index}
                className={`
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-bold

                  ${badge.className}
                `}
              >

                <Icon
                  className="
                    h-4
                    w-4
                  "
                />

                {badge.label}

              </div>

            )

          }
        )
      }


    </div>

  )
}