function Checkbox({ id, label, error, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          id={id}
          className="peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-md border-2 border-border-strong bg-white shadow-card transition-all duration-200 accent-primary focus:outline-none focus:ring-4 focus:ring-primary-600/15 focus:ring-offset-0 checked:border-primary-600 checked:bg-primary-600 checked:bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%223%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22M20.3%204.7a1%201%200%20010%201.4l-9.5%209.5a1%201%200%2001-1.4%200l-5.5-5.5a1%201%200%20111.4-1.4L10%2013.6l8.9-8.9a1%201%200%20011.4%200z%22/%3E%3C/svg%3E')] bg-center bg-[length:80%]"
          {...props}
        />
        {label && <span className="text-sm text-ink">{label}</span>}
      </label>
      {error && (
        <p className="mt-1.5 animate-fade-in text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Checkbox
