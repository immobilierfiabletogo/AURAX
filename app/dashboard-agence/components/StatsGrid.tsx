'use client'

import {
  Home,
  Eye,
  CheckCircle2,
  MessageSquare,
  Zap,
} from 'lucide-react'


interface Props {
  listings:number
  views:number
  active:number
  whatsapp:number
  boosted:number
}



const cards = [
  {
    key: 'listings',
    label: 'Annonces publiées',
    icon: Home,
    featured: true,
  },
  {
    key: 'views',
    label: 'Vues totales',
    icon: Eye,
    featured: false,
  },
  {
    key: 'active',
    label: 'Biens en ligne',
    icon: CheckCircle2,
    featured: false,
  },
  {
    key: 'whatsapp',
    label: 'Contacts WhatsApp',
    icon: MessageSquare,
    featured: false,
  },
  {
    key: 'boosted',
    label: 'Annonces boostées',
    icon: Zap,
    featured: false,
  },
] as const



export default function StatsGrid({
  listings,
  views,
  active,
  whatsapp,
  boosted,
}:Props){


const values = {
  listings,
  views,
  active,
  whatsapp,
  boosted,
}



return (

<section
className="
mb-10
grid
grid-cols-1
gap-5
sm:grid-cols-2
xl:grid-cols-5
"
>


{cards.map((card)=>{

const Icon = card.icon
const value = values[card.key]


return (

<article
key={card.key}
className={`
group
relative
overflow-hidden
rounded-[26px]
border
border-emerald-100
bg-gradient-to-br
from-white
via-white
to-emerald-50/40
p-6
shadow-[0_18px_50px_rgba(16,185,129,0.08)]
transition-all
duration-300
hover:-translate-y-1
hover:shadow-[0_25px_70px_rgba(16,185,129,0.15)]
${card.featured ? 'xl:scale-[1.02]' : ''}
`}
>


{/* Glow */}

<div
className="
absolute
-right-10
-top-10
h-32
w-32
rounded-full
bg-emerald-400/20
blur-3xl
opacity-0
transition
group-hover:opacity-100
"
/>



<div
className="
relative
flex
items-center
justify-between
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
bg-gradient-to-br
from-emerald-500
to-emerald-700
shadow-lg
shadow-emerald-500/20
"
>

<Icon
className="
h-5
w-5
text-white
"
/>

</div>


{card.featured && (

<span
className="
rounded-full
bg-amber-50
px-3
py-1
text-[10px]
font-bold
uppercase
tracking-widest
text-amber-700
"
>
Principal
</span>

)}


</div>




<div
className="
relative
mt-8
"
>


<div
className="
text-4xl
font-bold
tracking-tight
text-slate-950
"
>
{new Intl.NumberFormat('fr-FR').format(value)}
</div>



<p
className="
mt-3
text-sm
font-medium
text-slate-500
"
>
{card.label}
</p>


</div>



</article>

)

})}



</section>

)

}