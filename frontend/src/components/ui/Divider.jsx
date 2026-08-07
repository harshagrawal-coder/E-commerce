function Divider({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      {children && <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{children}</span>}
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  )
}

export default Divider
