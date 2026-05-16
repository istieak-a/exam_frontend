export function SpikeMark({ size = 18, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 1.5 13.05 10.95 22.5 12l-9.45 1.05L12 22.5l-1.05-9.45L1.5 12l9.45-1.05L12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Wordmark({ size = 18, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 text-ink ${className}`}>
      <SpikeMark size={size} />
      <span className="font-display text-[18px] font-medium tracking-tight leading-none">
        ExamHub
      </span>
    </span>
  );
}

export default SpikeMark;
