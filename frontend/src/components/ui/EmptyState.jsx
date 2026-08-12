import { motion } from "framer-motion";

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 shadow-card"
        >
          <Icon size={26} strokeWidth={1.5} />
        </motion.div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export default EmptyState;
