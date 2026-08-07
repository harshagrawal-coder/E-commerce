import { Pencil, Trash2, Inbox } from 'lucide-react'

function DataTable({ columns, rows = [], keyField = '_id', loading, onEdit, onDelete, emptyMessage }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
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
                className="border-b border-border last:border-0 hover:bg-surface/60 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-ink">
                    {col.render ? col.render(row) : row[col.key] ?? '-'}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          aria-label="Edit"
                          className="rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-primary-50 hover:text-primary-600"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          aria-label="Delete"
                          className="rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-5 py-12">
                  <div className="flex flex-col items-center gap-2 text-ink-muted">
                    <Inbox size={32} strokeWidth={1.5} />
                    <p className="text-sm">{emptyMessage || 'No records found'}</p>
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
