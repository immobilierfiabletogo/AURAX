import { ReactNode } from "react";
import Panel from "./Panel";

interface StatPanelProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: ReactNode;
}

export default function StatPanel({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatPanelProps) {
  return (
    <Panel className="flex flex-col justify-between min-h-[190px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-3 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-6">
          {trend}
        </div>
      )}
    </Panel>
  );
}