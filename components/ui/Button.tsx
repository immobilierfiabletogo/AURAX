'use client'

import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function Button({
  variant = 'primary',
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded-2xl px-5 py-3 font-bold transition-all duration-300',
        variant === 'primary' &&
          'bg-slate-950 text-white hover:bg-black',

        variant === 'secondary' &&
          'border border-slate-200 bg-white hover:bg-slate-50',

        variant === 'ghost' &&
          'hover:bg-slate-100',

        className
      )}
    />
  )
}