import { Loader2 } from 'lucide-react'

function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) {
  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary-600/40 shadow-sm',
    secondary:
      'bg-white text-ink border border-border hover:bg-surface focus-visible:ring-ink/15 shadow-sm',
    ghost:
      'bg-transparent text-ink-muted hover:bg-surface hover:text-ink focus-visible:ring-ink/15',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/40 shadow-sm',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'transition-colors duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export default Button
