'use client'

import {
  Building2,
  CheckCircle2,
  MessageCircle,
  Phone,
  User,
} from 'lucide-react'

interface Props {
  agencyName?: string
  agencyPhone?: string
  ownerName?: string
  ownerPhone?: string
  isAgency: boolean
  onWhatsAppClick: () => void
}

export default function ListingContactCard({
  agencyName,
  agencyPhone,
  ownerName,
  ownerPhone,
  isAgency,
  onWhatsAppClick,
}: Props) {

  const name = isAgency
    ? agencyName
    : ownerName

  const phone = isAgency
    ? agencyPhone
    : ownerPhone


  const whatsappLink = phone
    ? `https://wa.me/${phone.replace(
        /\D/g,
        ''
      )}`
    : '#'


  return (
    <aside
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        space-y-6
      "
    >

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-emerald-100
          "
        >

          {isAgency ? (
            <Building2
              className="
                h-7
                w-7
                text-emerald-600
              "
            />
          ) : (
            <User
              className="
                h-7
                w-7
                text-emerald-600
              "
            />
          )}

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
            {isAgency
              ? 'Agence immobilière'
              : 'Propriétaire'}
          </p>


          <h3
            className="
              text-lg
              font-black
              text-slate-900
            "
          >
            {name || 'Contact AURAX'}
          </h3>

        </div>

      </div>



      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-emerald-50
          p-4
        "
      >

        <CheckCircle2
          className="
            h-5
            w-5
            text-emerald-600
          "
        />

        <div>

          <p
            className="
              text-sm
              font-bold
              text-emerald-800
            "
          >
            Disponible
          </p>


          <p
            className="
              text-xs
              text-emerald-700
            "
          >
            Répond généralement rapidement
          </p>

        </div>

      </div>



      <div
        className="
          space-y-3
        "
      >

        <a
          href={whatsappLink}
          target="_blank"
          onClick={onWhatsAppClick}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-emerald-600
            px-5
            py-4
            font-black
            text-white
            transition
            hover:bg-emerald-700
            hover:scale-[1.02]
          "
        >

          <MessageCircle
            className="
              h-5
              w-5
            "
          />

          Contacter sur WhatsApp

        </a>



        {phone && (

          <a
            href={`tel:${phone}`}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              px-5
              py-4
              font-black
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >

            <Phone
              className="
                h-5
                w-5
              "
            />

            Appeler

          </a>

        )}

      </div>


      <p
        className="
          text-center
          text-xs
          leading-5
          text-slate-400
        "
      >
        En contactant ce vendeur via AURAX,
        vous bénéficiez d'une expérience
        immobilière plus simple et sécurisée.
      </p>


    </aside>
  )
}