const iconVariants = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/15 text-[#2f6e3d]',
  warning: 'bg-warning/15 text-[#7a5a0e]',
  info: 'bg-accent-teal/15 text-[#326d63]',
  danger: 'bg-error/15 text-[#8a3636]',
  amber: 'bg-accent-amber/15 text-[#8a5a1a]',
};

export function StatCard({ title, value, subtitle, icon, variant = 'primary', trend }) {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted">{title}</p>
          <p className="mt-2 font-display text-[34px] leading-none tracking-[-0.02em] text-ink">
            {value}
          </p>
          {subtitle && <p className="mt-2 text-xs text-muted">{subtitle}</p>}
          {trend && (
            <div
              className={`mt-3 inline-flex items-center gap-0.5 text-xs font-medium ${
                trend.direction === 'up' ? 'text-[#2f6e3d]' : 'text-[#8a3636]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
              </span>
              {trend.value}
            </div>
          )}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconVariants[variant] || iconVariants.primary}`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-hairline" />
          <div className="h-8 w-20 animate-pulse rounded bg-hairline" />
          <div className="h-3 w-32 animate-pulse rounded bg-hairline" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-md bg-hairline" />
      </div>
    </div>
  );
}

export function QuickActionCard({
  title,
  description,
  icon,
  href,
  onClick,
  variant = 'primary',
  tone = 'cream',
}) {
  const surfaces = {
    cream: 'border border-hairline bg-canvas text-ink hover:bg-surface-soft',
    dark: 'border border-transparent bg-surface-dark text-on-dark hover:bg-surface-dark-elevated',
    coral: 'border border-transparent bg-primary text-on-primary hover:bg-primary-active',
  };

  const iconWrap =
    tone === 'dark'
      ? 'bg-on-dark/10 text-on-dark'
      : tone === 'coral'
        ? 'bg-on-primary/15 text-on-primary'
        : iconVariants[variant] || iconVariants.primary;

  const Component = href ? 'a' : 'button';
  const props = href ? { href } : { onClick };

  return (
    <Component
      {...props}
      className={`group flex items-center justify-between gap-3 rounded-lg p-5 text-left transition-colors duration-150 ${surfaces[tone]}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconWrap}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div className="text-left">
          <h3 className={`text-sm font-medium ${tone === 'dark' || tone === 'coral' ? 'text-current' : 'text-ink'}`}>
            {title}
          </h3>
          <p
            className={`text-xs ${tone === 'dark' ? 'text-on-dark-soft' : tone === 'coral' ? 'text-on-primary/85' : 'text-muted'}`}
          >
            {description}
          </p>
        </div>
      </div>
      <span className="material-symbols-outlined text-[18px] opacity-60 transition-transform group-hover:translate-x-0.5">
        arrow_forward
      </span>
    </Component>
  );
}

export function QuickActionCardSkeleton() {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-5">
      <div className="h-10 w-10 animate-pulse rounded-md bg-hairline" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-hairline" />
        <div className="h-3 w-full animate-pulse rounded bg-hairline" />
      </div>
    </div>
  );
}
