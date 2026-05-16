export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

  const variants = {
    primary:
      'bg-primary text-on-primary hover:bg-primary-active active:bg-primary-active disabled:bg-primary-disabled disabled:text-muted',
    secondary:
      'bg-canvas text-ink border border-hairline hover:bg-surface-soft active:bg-surface-card',
    'secondary-dark':
      'bg-surface-dark-elevated text-on-dark border border-transparent hover:bg-surface-dark-soft',
    'secondary-on-coral':
      'bg-canvas text-ink hover:bg-surface-soft active:bg-surface-card',
    ghost: 'bg-transparent text-ink hover:bg-surface-soft',
    link:
      'bg-transparent text-primary hover:text-primary-active underline-offset-4 hover:underline px-0',
    icon:
      'bg-canvas text-ink border border-hairline hover:bg-surface-soft rounded-full',
    outline:
      'bg-transparent text-ink border border-ink hover:bg-ink hover:text-on-primary',
    accent:
      'bg-accent-teal text-on-primary hover:opacity-90 active:opacity-100',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-5 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-9 w-9 p-0',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
