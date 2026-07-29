'use client'

import { Search } from 'lucide-react'

interface Props{
value:string
onChange:(value:string)=>void
placeholder?:string
}

export default function SearchInput({
value,
onChange,
placeholder="Rechercher..."
}:Props){

return(

<div className="relative">

<Search
size={17}
className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
/>

<input
value={value}
onChange={(e)=>onChange(e.target.value)}
placeholder={placeholder}
className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 outline-none transition focus:border-slate-950"
/>

</div>

)

}