'use client'

import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export default function Section({
  title,
  subtitle,
  action,
  children,
  className,
}: Props) {
  return (
    <section className={clsx("space-y-6", className)}>
      {(title || action) && (
        <div className="flex items-end justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-black tracking-tight">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {action}
        </div>
      )}

      {children}
    </section>
  )
}