import { ChevronDown } from 'lucide-react'

function Select({
  label,
  id,
  error,
  options = [],
  placeholder,
  className = '',
  ...props
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={[
            'h-11 w-full appearance-none rounded-xl border bg-white/90 px-3.5 pr-10 text-sm text-ink',
            'shadow-card transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-4 focus:ring-offset-0',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/15',
            className,
          ].join(' ')}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p className="mt-1.5 animate-fade-in text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
