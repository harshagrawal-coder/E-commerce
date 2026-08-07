function Checkbox({ id, label, error, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          id={id}
          className="peer h-4 w-4 shrink-0 cursor-pointer rounded border-border text-primary-600 accent-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600/25 focus:ring-offset-0"
          {...props}
        />
        {label && <span className="text-sm text-ink">{label}</span>}
      </label>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Checkbox
