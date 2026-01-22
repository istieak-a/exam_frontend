export function SectionWrapper({ 
  children, 
  className = '',
  background = 'light',
  ...props 
}) {
  const backgrounds = {
    light: 'bg-background-light',
    white: 'bg-white',
    dark: 'bg-background-dark text-white',
    gradient: 'bg-gradient-to-br from-primary/5 via-background-light to-accent/5',
  };

  return (
    <section 
      className={`py-16 md:py-24 ${backgrounds[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

export function Container({ children, className = '', size = 'default' }) {
  const sizes = {
    small: 'max-w-5xl',
    default: 'max-w-7xl',
    large: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ 
  badge,
  title, 
  subtitle,
  centered = true,
  className = '' 
}) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-light-primary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-text-light-secondary max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionWrapper;
