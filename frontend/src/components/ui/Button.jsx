import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

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
      'bg-primary text-white shadow-card hover:bg-primary-700 focus-visible:ring-primary-600/40 hover:shadow-primary',
    secondary:
      'bg-white/80 text-ink border border-border hover:bg-white hover:border-ink-muted/30 focus-visible:ring-ink/15 shadow-card backdrop-blur-sm',
    ghost:
      'bg-transparent text-ink-muted hover:bg-ink/5 hover:text-ink focus-visible:ring-ink/15',
    danger:
      'bg-red-600 text-white shadow-card hover:bg-red-700 focus-visible:ring-red-600/40 hover:shadow-float',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.6 }}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'transition-[background-color,border-color,box-shadow,color] duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </motion.button>
  )
}

export default Button
