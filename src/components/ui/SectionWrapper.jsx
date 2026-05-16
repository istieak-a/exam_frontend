export function SectionWrapper({
  children,
  className = '',
  background = 'canvas',
  spacing = 'section',
  ...props
}) {
  const backgrounds = {
    canvas: 'bg-canvas text-ink',
    soft: 'bg-surface-soft text-ink',
    card: 'bg-surface-card text-ink',
    dark: 'bg-surface-dark text-on-dark',
    coral: 'bg-primary text-on-primary',
    /* legacy aliases */
    light: 'bg-canvas text-ink',
    white: 'bg-canvas text-ink',
    gradient: 'bg-canvas text-ink',
  };

  const spacings = {
    section: 'py-20 md:py-24 lg:py-[96px]',
    md: 'py-16 md:py-20',
    sm: 'py-12 md:py-16',
    none: '',
  };

  return (
    <section
      className={`${backgrounds[background] || backgrounds.canvas} ${spacings[spacing]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

export function Container({ children, className = '', size = 'default' }) {
  const sizes = {
    small: 'max-w-3xl',
    narrow: 'max-w-4xl',
    default: 'max-w-[1200px]',
    large: 'max-w-[1320px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-6 sm:px-8 lg:px-10 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  centered = false,
  className = '',
  tone = 'default',
}) {
  const titleTone = tone === 'dark' ? 'text-on-dark' : 'text-ink';
  const subtitleTone = tone === 'dark' ? 'text-on-dark-soft' : 'text-body';
  const badgeStyle =
    tone === 'dark'
      ? 'bg-on-dark/10 text-on-dark'
      : 'bg-primary/10 text-primary';

  return (
    <div className={`mb-12 md:mb-14 ${centered ? 'text-center mx-auto' : ''} ${className}`}>
      {badge && (
        <span
          className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] ${badgeStyle}`}
        >
          {badge}
        </span>
      )}
      <h2 className={`font-display text-[40px] leading-[1.1] tracking-[-0.025em] md:text-[48px] ${titleTone}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 max-w-2xl text-base md:text-lg leading-relaxed ${subtitleTone} ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionWrapper;
