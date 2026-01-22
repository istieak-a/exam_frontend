export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 cursor-pointer';
  
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90 hover:scale-105 shadow-lg shadow-primary/25',
    secondary: 'bg-white border border-border-light text-text-light-primary hover:bg-gray-50 hover:border-primary/30',
    ghost: 'bg-primary/10 text-primary hover:bg-primary/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    accent: 'bg-accent text-white hover:opacity-90 hover:scale-105 shadow-lg shadow-accent/25',
  };

  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
