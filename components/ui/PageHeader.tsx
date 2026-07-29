'use client'

interface Props {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: Props) {
  return (
    <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="text-[11px] font-black uppercase tracking-[0.35em] text-amber-500">
          {eyebrow}
        </span>

        <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-500">
          {description}
        </p>
      </div>

      {action}
    </section>
  )
}