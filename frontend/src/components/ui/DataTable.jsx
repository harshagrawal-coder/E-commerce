import { Pencil, Trash2, Eye, Inbox } from 'lucide-react'
import { motion } from 'framer-motion'

function DataTable({
  columns,
  rows = [],
  keyField = '_id',
  loading,
  onView,
  onEdit,
  onDelete,
  emptyMessage,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="max-h-[calc(100vh-19rem)] overflow-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-border bg-surface/95 shadow-[0_1px_0_0_rgba(16,24,40,0.05)] backdrop-blur-sm">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                >
                  {col.header}
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row[keyField]}
                className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-primary-50/40"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-ink">
                    {col.render ? col.render(row) : row[col.key] ?? '-'}
                  </td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onView(row)}
                          aria-label="View"
                          className="rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </motion.button>
                      )}
                      {onEdit && (
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(row)}
                          aria-label="Edit"
                          className="rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-primary-50 hover:text-primary-600"
                        >
                          <Pencil size={16} />
                        </motion.button>
                      )}
                      {onDelete && (
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(row)}
                          aria-label="Delete"
                          className="rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0)}
                  className="px-5 py-14"
                >
                  <div className="flex flex-col items-center gap-2 text-ink-muted">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface text-ink-light"
                    >
                      <Inbox size={24} strokeWidth={1.5} />
                    </motion.div>
                    <p className="text-sm">
                      {emptyMessage || 'No records found'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-ink-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
          Loading...
        </div>
      )}
    </div>
  )
}

export default DataTable
