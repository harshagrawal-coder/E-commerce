import { Trash2 } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

function ConfirmDialog({ open, onClose, onConfirm, title, message, loading = false }) {
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
          <Button variant="danger" onClick={onConfirm} loading={loading} disabled={loading}>
            {!loading && <Trash2 size={16} />}
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-muted">{message}</p>
    </Modal>
  )
}

export default ConfirmDialog
