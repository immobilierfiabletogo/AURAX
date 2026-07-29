'use client'

import { Inbox } from 'lucide-react'

interface Props{
title:string
description:string
}

export default function EmptyState({
title,
description,
}:Props){

return(

<div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-200 bg-white py-20">

<div className="mb-5 rounded-3xl bg-slate-100 p-5">

<Inbox/>

</div>

<h3 className="text-xl font-bold">

{title}

</h3>

<p className="mt-2 max-w-md text-center text-slate-500">

{description}

</p>

</div>

)

}