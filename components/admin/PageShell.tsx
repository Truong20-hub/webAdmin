import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export function PageShell({
  title,
  description,
  action,
  children,
}: PageShellProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-violet-100 bg-white/90 p-5 shadow-[0_20px_60px_rgba(140,122,255,0.08)] backdrop-blur-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
              Management
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-800">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
