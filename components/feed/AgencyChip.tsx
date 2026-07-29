'use client'

import Link from 'next/link'

interface Props {
  id: string
  name: string
}

export default function AgencyChip({
  id,
  name,
}: Props) {
  return (
    <Link
      href={`/stand/${id}`}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:border-slate-950"
    >
      {name}
    </Link>
  )
}