import { motion } from 'framer-motion'

function Toggle({ id, checked = false, onChange, disabled = false, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-ink">{label}</p>}
          {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
        </div>
      )}
      <motion.button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        whileTap={disabled ? undefined : { scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={[
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600/20 focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary shadow-card" : "bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
            checked ? "translate-x-6" : "translate-x-1",
          ].join(" ")}
        />
      </motion.button>
    </div>
  );
}

export default Toggle;
