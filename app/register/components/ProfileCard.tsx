'use client'

import {
  Building2,
  Check,
  ArrowRight,
} from 'lucide-react'


interface ProfileCardProps {
  icon: React.ElementType
  title: string
  description: string
  advantages: string[]
  color: string
  background: string
  border: string
  buttonLabel: string
  onClick: () => void
}


export default function ProfileCard({
  icon: Icon,
  title,
  description,
  advantages,
  buttonLabel,
  onClick,
}: ProfileCardProps) {

  return (

    <div
      className="
        group relative overflow-hidden
        rounded-[36px]
        border border-emerald-100
        bg-white
        p-8
        shadow-[0_25px_80px_rgba(15,23,42,.08)]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-[0_35px_90px_rgba(5,150,105,.15)]
      "
    >

      {/* Glow background */}

      <div
        className="
          absolute
          -right-20
          -top-20
          h-56
          w-56
          rounded-full
          bg-emerald-100/50
          blur-3xl
          transition
          group-hover:bg-emerald-200/60
        "
      />


      <div className="relative">


        {/* Badge */}

        <div
          className="
            mb-8
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-2
            text-xs
            font-bold
            uppercase
            tracking-[0.25em]
            text-emerald-700
          "
        >
          <Building2 size={14}/>

          Partenaire AURAX

        </div>



        {/* Icon */}

        <div
          className="
            mb-7
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-gradient-to-br
            from-emerald-600
            to-emerald-500
            text-white
            shadow-lg
            shadow-emerald-200
          "
        >

          <Icon size={38}/>

        </div>



        <h3
          className="
            text-3xl
            font-black
            tracking-tight
            text-slate-900
          "
        >
          {title}
        </h3>



        <p
          className="
            mt-4
            text-lg
            leading-8
            text-slate-600
          "
        >
          {description}
        </p>



        {/* Advantages */}

        <div className="mt-8 space-y-4">

          {advantages.map((item) => (

            <div
              key={item}
              className="
                flex
                items-center
                gap-3
                text-slate-700
              "
            >

              <div
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-100
                  text-emerald-700
                "
              >

                <Check size={14}/>

              </div>


              <span className="font-medium">
                {item}
              </span>


            </div>

          ))}

        </div>



        {/* CTA */}

        <button
          onClick={onClick}
          className="
            mt-10
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-emerald-600
            py-5
            text-lg
            font-bold
            text-white
            transition
            hover:bg-emerald-500
          "
        >

          {buttonLabel}

          <ArrowRight
            size={20}
            className="
              transition
              group-hover:translate-x-1
            "
          />

        </button>


      </div>


    </div>

  )
}