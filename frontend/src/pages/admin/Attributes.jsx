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

const inputTypes = ['select', 'multiselect', 'text', 'number', 'boolean']

const emptyForm = {
  name: '',
  inputType: 'select',
  isVariant: false,
  isFilterable: true,
  isRequired: false,
  isActive: true,
  displayOrder: 0,
}

function Attributes() {
  const rows = []
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
      name: row.name || '',
      inputType: row.inputType || 'select',
      isVariant: row.isVariant ?? false,
      isFilterable: row.isFilterable ?? true,
      isRequired: row.isRequired ?? false,
      isActive: row.isActive ?? true,
      displayOrder: row.displayOrder ?? 0,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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

  const columns = [
    { key: 'name', header: 'Name', render: (row) => <span className="font-medium text-ink">{row.name}</span> },
    { key: 'slug', header: 'Slug' },
    {
      key: 'inputType',
      header: 'Input Type',
      render: (row) => <Badge tone="gray">{row.inputType}</Badge>,
    },
    {
      key: 'flags',
      header: 'Flags',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.isVariant && <Badge tone="blue">Variant</Badge>}
          {row.isFilterable && <Badge tone="amber">Filterable</Badge>}
          {row.isRequired && <Badge tone="red">Required</Badge>}
          {!row.isVariant && !row.isFilterable && !row.isRequired && <span className="text-ink-muted">-</span>}
        </div>
      ),
    },
    { key: 'displayOrder', header: 'Order' },
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
        title="Attributes"
        description="Manage product attributes"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Attribute
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
        emptyMessage="No attributes yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Attribute' : 'Add Attribute'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="attribute-form" loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <form id="attribute-form" onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Color"
            required
          />
          <Select
            id="inputType"
            label="Input Type"
            value={form.inputType}
            onChange={(e) => setForm((p) => ({ ...p, inputType: e.target.value }))}
            options={inputTypes.map((t) => ({ value: t, label: t }))}
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
              id="isVariant"
              checked={form.isVariant}
              onChange={(e) => setForm((p) => ({ ...p, isVariant: e.target.checked }))}
              label="Creates product variants"
            />
            <Checkbox
              id="isFilterable"
              checked={form.isFilterable}
              onChange={(e) => setForm((p) => ({ ...p, isFilterable: e.target.checked }))}
              label="Filterable"
            />
            <Checkbox
              id="isRequired"
              checked={form.isRequired}
              onChange={(e) => setForm((p) => ({ ...p, isRequired: e.target.checked }))}
              label="Required"
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
        title="Delete attribute"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default Attributes
