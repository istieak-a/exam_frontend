export function Card({ 
  children, 
  className = '', 
  hover = true,
  padding = 'default',
  ...props 
}) {
  const paddings = {
    default: 'p-6',
    large: 'p-8',
    small: 'p-4',
    none: '',
  };

  const hoverStyles = hover 
    ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1' 
    : '';

  return (
    <div
      className={`
        rounded-2xl border border-border-light bg-foreground-light 
        transition-all duration-300 
        ${hoverStyles} 
        ${paddings[padding]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`
        rounded-2xl bg-white/70 backdrop-blur-xl 
        border border-white/50 shadow-xl 
        ring-1 ring-black/5
        ${className}
      `}
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
  className = '' 
}) {
  const sizes = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const variants = {
    primary: 'bg-primary/10 text-primary',
    white: 'bg-white text-primary shadow-lg',
    gradient: 'bg-gradient-to-br from-primary to-accent text-white',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div className={`
      flex items-center justify-center rounded-xl
      ${sizes[size]} 
      ${variants[variant]} 
      ${className}
    `}>
      {icon}
    </div>
  );
}

export default Card;
