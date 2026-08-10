import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Checkbox from '../../components/ui/Checkbox'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorAlert from '../../components/ui/ErrorAlert'

const emptyForm = { attribute: '', value: '', displayOrder: 0, isDefault: false, isActive: true }

function AttributeValues() {
  const rows = []
  const attributes = []
  const loading = false
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({
      attribute: row.attribute?._id ?? row.attribute ?? '',
      value: row.value || '',
      displayOrder: row.displayOrder ?? 0,
      isDefault: row.isDefault ?? false,
      isActive: row.isActive ?? true,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.attribute) {
      setError('Attribute is required')
      return
    }
    setError('')
    setSaving(true)
    setModalOpen(false)
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteTarget(null)
    setDeleting(false)
  }

  const attributeOptions = attributes.map((a) => ({ value: a._id, label: a.name }))

  const columns = [
    { key: 'value', header: 'Value', render: (row) => <span className="font-medium text-ink">{row.value}</span> },
    { key: 'slug', header: 'Slug' },
    {
      key: 'attribute',
      header: 'Attribute',
      render: (row) => <span className="text-ink-muted">{row.attribute?.name ?? row.attribute ?? '-'}</span>,
    },
    { key: 'displayOrder', header: 'Order' },
    {
      key: 'isDefault',
      header: 'Default',
      render: (row) =>
        row.isDefault ? <Badge tone="blue">Default</Badge> : <span className="text-ink-muted">-</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) =>
        row.isActive ? <Badge tone="green">Active</Badge> : <Badge tone="red">Inactive</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attribute Values"
        description="Manage values for product attributes"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Value
          </Button>
        }
      />

      <ErrorAlert message={error} />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No attribute values yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Attribute Value' : 'Add Attribute Value'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="attribute-value-form" loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <form id="attribute-value-form" onSubmit={handleSubmit} className="space-y-5">
          <Select
            id="attribute"
            label="Attribute"
            value={form.attribute}
            onChange={(e) => setForm((p) => ({ ...p, attribute: e.target.value }))}
            options={attributeOptions}
            placeholder="Select an attribute"
            required
          />
          <Input
            id="value"
            label="Value"
            value={form.value}
            onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
            placeholder="Red"
            required
          />
          <Input
            id="displayOrder"
            label="Display Order"
            type="number"
            value={form.displayOrder}
            onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
          />
          <div className="space-y-3">
            <Checkbox
              id="isDefault"
              checked={form.isDefault}
              onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
              label="Default value"
            />
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              label="Active"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete attribute value"
        message={`Are you sure you want to delete "${deleteTarget?.value}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default AttributeValues
