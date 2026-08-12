function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-lg bg-slate-200/60 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export function TableSkeleton({ columns = 8, rows = 6 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-border bg-surface/70 px-5 py-3.5">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className={`h-3 ${i === 0 ? "w-24" : "w-16"}`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0"
        >
          <Skeleton className="h-11 w-11 rounded-lg" />
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
