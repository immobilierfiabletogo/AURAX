import { ReactNode } from "react";
import Link from "next/link";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 px-8 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-black text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-8 inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </Link>
      )}

    </div>
  );
}