const statusStyles = {
  active: {
    dot: "bg-emerald-500",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "check",
  },
  inactive: {
    dot: "bg-slate-400",
    classes: "bg-slate-100 text-slate-600 border-slate-200",
    icon: "ban",
  },
  featured: {
    dot: "bg-amber-500",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "star",
  },
  default: {
    dot: "bg-blue-500",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "check",
  },
  inStock: {
    dot: "bg-emerald-500",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "check",
  },
  lowStock: {
    dot: "bg-amber-500",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "alert",
  },
  outOfStock: {
    dot: "bg-red-500",
    classes: "bg-red-50 text-red-700 border-red-200",
    icon: "ban",
  },
  draft: {
    dot: "bg-slate-400",
    classes: "bg-slate-100 text-slate-600 border-slate-200",
    icon: "ban",
  },
};

function StatusBadge({ status = "active", label, children, className = "" }) {
  const style = statusStyles[status] || statusStyles.active;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-card ${style.classes} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {label || children || status}
    </span>
  );
}

export default StatusBadge;
