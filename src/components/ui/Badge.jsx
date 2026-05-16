export function Badge({
  children,
  variant = 'pill',
  size = 'md',
  pulse = false,
  className = '',
}) {
  const variants = {
    pill: 'bg-surface-card text-ink border border-transparent',
    canvas: 'bg-canvas text-ink border border-hairline',
    cream: 'bg-surface-card text-ink border border-transparent',
    coral: 'bg-primary text-on-primary border border-transparent uppercase tracking-[0.15em]',
    'coral-soft': 'bg-primary/10 text-primary border border-primary/15',
    dark: 'bg-surface-dark text-on-dark border border-transparent',
    success: 'bg-success/15 text-[#2f6e3d] border border-success/25',
    warning: 'bg-warning/15 text-[#7a5a0e] border border-warning/30',
    info: 'bg-accent-teal/15 text-[#326d63] border border-accent-teal/25',
    error: 'bg-error/15 text-[#8a3636] border border-error/25',
    accent: 'bg-accent-amber/20 text-[#8a5a1a] border border-accent-amber/30',
    /* legacy */
    primary: 'bg-primary/10 text-primary border border-primary/15',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-[12px]',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium leading-none ${variants[variant] || variants.pill} ${sizes[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
