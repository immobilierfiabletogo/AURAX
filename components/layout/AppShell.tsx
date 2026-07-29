'use client'

import { ReactNode } from 'react'

interface AppShellProps {
  sidebar: ReactNode
  topbar: ReactNode
  children: ReactNode
}

export default function AppShell({
  sidebar,
  topbar,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {sidebar}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {topbar}

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}