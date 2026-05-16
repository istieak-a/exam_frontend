import { useState } from 'react';

export function Input({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon,
  rightIcon,
  disabled = false,
  required = false,
  autoComplete,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full h-10 rounded-md bg-canvas px-3.5 text-sm text-ink
            placeholder:text-muted-soft
            transition-colors duration-150
            focus:outline-none
            ${icon ? 'pl-10' : ''}
            ${isPassword || rightIcon ? 'pr-10' : ''}
            disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-muted
            ${error
              ? 'border border-error focus:border-error focus:ring-2 focus:ring-error/20'
              : 'border border-hairline focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="h-4.5 w-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-4.5 w-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-error">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  hint,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-md bg-canvas px-3.5 py-2.5 text-sm text-ink
          placeholder:text-muted-soft
          transition-colors duration-150
          focus:outline-none resize-y
          disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-muted
          ${error
            ? 'border border-error focus:border-error focus:ring-2 focus:ring-error/20'
            : 'border border-hairline focus:border-primary focus:ring-2 focus:ring-primary/20'
          }
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
}) {
  return (
    <label
      className={`flex cursor-pointer select-none items-center gap-2.5 ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      <span className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <span className="block h-4 w-4 rounded border border-hairline bg-canvas transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20">
          <svg
            className={`h-full w-full p-0.5 text-on-primary transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </span>
      {label && <span className="text-sm text-body">{label}</span>}
    </label>
  );
}

export default Input;
