'use client'

import { ReactNode } from 'react'

interface Props {
  sidebar: ReactNode
  topbar: ReactNode
  hero: ReactNode
  stats: ReactNode
  toolbar: ReactNode
  content: ReactNode
}

export default function CockpitLayout({
  sidebar,
  topbar,
  hero,
  stats,
  toolbar,
  content,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      {sidebar}

      <div className="lg:pl-64">

        {topbar}

        <main className="mx-auto max-w-7xl px-6 py-8">

          <section>

            {hero}

          </section>

          <section className="mt-10">

            {stats}

          </section>

          <section className="mt-10">

            {toolbar}

          </section>

          <section className="mt-8">

            {content}

          </section>

        </main>

      </div>

    </div>
  )
}