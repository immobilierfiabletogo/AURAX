'use client'

import Badge from '@/components/ui/Badge'

interface Props {
  name: string
  plan: string
  listings: number
}

export default function CockpitHero({
  name,
  plan,
  listings,
}: Props) {

  const planLabel =
    plan === 'premium'
      ? 'AURAX PREMIUM'
      : plan === 'pro'
      ? 'AURAX PRO'
      : 'AURAX START'


  return (
    <section
      className="
        relative
        mb-10
        overflow-hidden
        rounded-[32px]
        border
        border-emerald-100
        bg-gradient-to-br
        from-white
        via-emerald-50/40
        to-amber-50/30
        shadow-[0_30px_90px_rgba(16,185,129,0.12)]
      "
    >

      {/* Dégradés ambiance AURAX */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-transparent
          via-transparent
          to-emerald-100/40
        "
      />


      <div
        className="
          absolute
          -right-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-gradient-to-br
          from-emerald-400/40
          via-emerald-500/20
          to-transparent
          blur-3xl
        "
      />


      <div
        className="
          absolute
          -left-32
          bottom-0
          h-80
          w-80
          rounded-full
          bg-gradient-to-tr
          from-amber-300/30
          via-emerald-300/20
          to-transparent
          blur-3xl
        "
      />



      <div
        className="
          relative
          p-6
          sm:p-8
          lg:p-10
        "
      >

        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >

          {/* Présentation */}

          <div
            className="
              max-w-2xl
            "
          >

            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  rounded-full
                  bg-slate-950
                  px-4
                  py-1.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.28em]
                  text-white
                "
              >
                AURAX Studio
              </span>


              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-emerald-700
                "
              >
                Espace agence
              </span>

            </div>



            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-4xl
              "
            >
              Bonjour, {name}
            </h1>



            <p
              className="
                mt-4
                max-w-xl
                text-sm
                leading-7
                text-slate-600
              "
            >
              Votre cockpit immobilier AURAX centralise
              vos annonces, votre visibilité et vos
              performances commerciales.
            </p>


          </div>




          {/* Informations */}

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              lg:flex-col
              xl:flex-row
            "
          >

            <div
              className="
                min-w-[180px]
                rounded-2xl
                border
                border-emerald-100
                bg-white/80
                px-6
                py-5
                shadow-sm
                backdrop-blur
              "
            >

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-slate-400
                "
              >
                Portefeuille
              </p>


              <div
                className="
                  mt-2
                  flex
                  items-end
                  gap-2
                "
              >

                <span
                  className="
                    text-3xl
                    font-bold
                    text-slate-950
                  "
                >
                  {listings}
                </span>


                <span
                  className="
                    pb-1
                    text-sm
                    text-slate-400
                  "
                >
                  biens
                </span>


              </div>

            </div>




            <div
              className="
                flex
                items-center
              "
            >

              <Badge
                variant={
                  plan === 'premium'
                    ? 'premium'
                    : plan === 'pro'
                    ? 'pro'
                    : 'start'
                }
              >
                {planLabel}
              </Badge>

            </div>


          </div>


        </div>




        {/* Séparation */}

        <div
          className="
            my-8
            h-px
            bg-gradient-to-r
            from-transparent
            via-emerald-200
            to-transparent
          "
        />




        {/* Indicateurs */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-3
          "
        >

          <Metric
            label="Statut"
            value="Actif"
          />

          <Metric
            label="Visibilité"
            value="Optimisée"
          />

          <Metric
            label="Plateforme"
            value="AURAX"
          />


        </div>


      </div>


    </section>
  )
}



function Metric({
  label,
  value,
}: {
  label:string
  value:string
}) {

  return (
    <div
      className="
        rounded-2xl
        border
        border-emerald-100
        bg-white/70
        px-5
        py-4
        backdrop-blur
      "
    >

      <p
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.25em]
          text-slate-400
        "
      >
        {label}
      </p>


      <p
        className="
          mt-2
          text-lg
          font-semibold
          text-slate-950
        "
      >
        {value}
      </p>

    </div>
  )
}