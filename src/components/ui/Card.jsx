export function Card({
  children,
  className = '',
  variant = 'cream',
  padding = 'default',
  hover = false,
  ...props
}) {
  const paddings = {
    default: 'p-8',
    large: 'p-12',
    small: 'p-5',
    snug: 'p-6',
    none: '',
  };

  const variants = {
    cream: 'bg-surface-card text-ink',
    canvas: 'bg-canvas text-ink border border-hairline',
    soft: 'bg-surface-soft text-ink',
    dark: 'bg-surface-dark text-on-dark',
    'dark-elevated': 'bg-surface-dark-elevated text-on-dark',
    coral: 'bg-primary text-on-primary',
  };

  const hoverStyles = hover
    ? variant === 'dark' || variant === 'dark-elevated'
      ? 'hover:bg-surface-dark-elevated transition-colors duration-150'
      : 'hover:border-primary/40 hover:bg-surface-soft transition-colors duration-150'
    : '';

  return (
    <div
      className={`rounded-lg ${variants[variant] || variants.cream} ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Legacy alias — kept so existing imports keep working. Renders a canvas card.
export function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-lg bg-canvas border border-hairline ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function IconBox({
  icon,
  size = 'md',
  variant = 'primary',
  className = '',
}) {
  const sizes = {
    sm: 'w-9 h-9 text-lg',
    md: 'w-11 h-11 text-xl',
    lg: 'w-14 h-14 text-2xl',
  };

  const variants = {
    primary: 'bg-primary/10 text-primary',
    coral: 'bg-primary text-on-primary',
    cream: 'bg-surface-card text-ink',
    canvas: 'bg-canvas border border-hairline text-ink',
    dark: 'bg-surface-dark-elevated text-on-dark',
    teal: 'bg-accent-teal/15 text-accent-teal',
    amber: 'bg-accent-amber/15 text-accent-amber',
    success: 'bg-success/15 text-[#3a8a4d]',
    warning: 'bg-warning/15 text-[#8a6a10]',
    error: 'bg-error/15 text-[#9a3636]',
    /* legacy aliases */
    white: 'bg-canvas border border-hairline text-ink',
    secondary: 'bg-surface-card text-ink',
    accent: 'bg-accent-teal/15 text-accent-teal',
    gradient: 'bg-primary text-on-primary',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-md ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
    >
      {icon}
    </div>
  );
}

export default Card;
