function Select({ label, id, error, options = [], placeholder, className = '', ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        id={id}
        className={[
          'h-11 w-full appearance-none rounded-xl border bg-white px-3.5 text-sm text-ink',
          'shadow-sm transition-colors duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/25'
            : 'border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/25',
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
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Select
