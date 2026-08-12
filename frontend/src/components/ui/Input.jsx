function Input({
  label,
  id,
  error,
  hint,
  icon,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={[
            'h-11 w-full rounded-xl border bg-white/90 text-sm text-ink',
            'placeholder:text-ink-muted/60',
            'shadow-card transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-4 focus:ring-offset-0',
            icon && 'pl-10',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/15',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 animate-fade-in text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default Input
