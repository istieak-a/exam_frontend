// Reusable card components for dashboard

// Stat Card Component
export function StatCard({ title, value, subtitle, icon, variant = 'primary', trend }) {
  const variants = {
    primary: 'bg-purple-50 text-purple-600',
    success: 'bg-teal-50 text-teal-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-sky-50 text-sky-600',
    danger: 'bg-red-50 text-red-600',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${variants[variant]}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-sm font-medium text-slate-900">{title}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {trend && (
            <div className={`mt-1 inline-flex items-center gap-0.5 text-xs font-medium ${
              trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              <span className="material-symbols-outlined text-sm">
                {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
              </span>
              {trend.value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
          <div className="mt-2 h-8 w-20 rounded bg-slate-200 animate-pulse" />
          <div className="mt-1 h-3 w-32 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

// Quick Action Card Component
export function QuickActionCard({ title, description, icon, href, onClick, variant = 'primary' }) {
  const iconColors = {
    primary: 'bg-blue-50 text-primary',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-sky-50 text-sky-600',
  };

  const Component = href ? 'a' : 'button';
  const props = href ? { href } : { onClick };

  return (
    <Component
      {...props}
      className="group relative flex items-center justify-between gap-3 rounded-xl bg-white p-4 border border-slate-200 transition-all duration-200 hover:shadow-md hover:border-slate-300 active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconColors[variant]}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <span className="material-symbols-outlined text-slate-400 text-lg transition-transform group-hover:translate-x-1">
        arrow_forward
      </span>
    </Component>
  );
}

// Quick Action Card Skeleton
export function QuickActionCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/80">
      <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="mt-3 h-4 w-24 rounded bg-slate-200 animate-pulse" />
    </div>
  );
}
