import { AlertCircle } from 'lucide-react'

function ErrorAlert({ message, className = '' }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className={[
        'flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700',
        className,
      ].join(' ')}
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export default ErrorAlert
