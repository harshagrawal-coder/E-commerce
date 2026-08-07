function SuccessAlert({ message, className = '' }) {
  if (!message) return null
  return (
    <div
      role="status"
      className={[
        'flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 text-sm text-green-700',
        className,
      ].join(' ')}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2.5 6.5 5 9l4.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{message}</span>
    </div>
  )
}

export default SuccessAlert
