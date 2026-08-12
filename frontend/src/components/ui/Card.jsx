import { motion } from 'framer-motion'

function Card({
  children,
  title,
  description,
  icon: Icon,
  action,
  className = "",
  bodyClassName = "",
  hoverable = false,
  glass = false,
}) {
  return (
    <motion.section
      whileHover={hoverable ? { y: -2, scale: 1.01 } : undefined}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={[
        "overflow-hidden rounded-2xl border shadow-card",
        "transition-[box-shadow,border-color] duration-300 ease-out",
        glass
          ? "glass-card"
          : "border-border bg-white",
        hoverable ? "hover:border-border-strong hover:shadow-raised" : "",
        className,
      ].join(" ")}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-6 py-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 shadow-card">
                <Icon size={18} strokeWidth={1.8} />
              </div>
            )}
            <div>
              {title && <h3 className="text-sm font-semibold text-ink">{title}</h3>}
              {description && (
                <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`px-6 py-5 ${bodyClassName}`}>{children}</div>
    </motion.section>
  );
}

export default Card;
