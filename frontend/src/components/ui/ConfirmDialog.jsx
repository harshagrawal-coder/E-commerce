import { Trash2 } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
  confirmLabel = 'Delete',
  loadingLabel = 'Deleting...',
  confirmIcon: ConfirmIcon = Trash2,
  confirmVariant = 'danger',
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || 'Confirm action'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading} disabled={loading}>
            {!loading && <ConfirmIcon size={16} />}
            {loading ? loadingLabel : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-muted">{message}</p>
    </Modal>
  )
}

export default ConfirmDialog
