import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Checkbox from '../../components/ui/Checkbox'
import Badge from '../../components/ui/Badge'
import ImageUpload from '../../components/ui/ImageUpload'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorAlert from '../../components/ui/ErrorAlert'
import api from '../../services/api'

const emptyForm = { name: '', description: '', isActive: true }

function Categories() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const data = await api('/category')
      setRows(data.data ?? data.categories ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      await fetchData()
    }
    load()
  }, [fetchData])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setImage(null)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({
      name: row.name || '',
      description: row.description || '',
      isActive: row.isActive ?? true,
    })
    setImage(null)
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const body = new FormData()
      body.append('name', form.name)
      body.append('description', form.description)
      body.append('isActive', form.isActive)
      if (image) body.append('image', image)

      if (editing) {
        await api(`/category/${editing._id}`, { method: 'PUT', body, isFormData: true })
      } else {
        await api('/category', { method: 'POST', body, isFormData: true })
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api(`/category/${deleteTarget._id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (row) =>
        row.image?.url ? (
          <img src={row.image.url} alt={row.name} className="h-10 w-10 rounded-lg border border-border object-cover" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-xs text-ink-muted">
            -
          </span>
        ),
    },
    { key: 'name', header: 'Name', render: (row) => <span className="font-medium text-ink">{row.name}</span> },
    { key: 'slug', header: 'Slug' },
    { key: 'description', header: 'Description', render: (row) => <span className="line-clamp-1 text-ink-muted">{row.description || '-'}</span> },
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
        title="Categories"
        description="Manage product categories"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Category
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
        emptyMessage="No categories yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="category-form" loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Electronics"
            required
          />
          <Input
            id="description"
            label="Description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Category description (optional)"
          />
          <ImageUpload label="Image" value={image} onChange={setImage} previewUrl={editing?.image?.url} />
          <Checkbox
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            label="Active"
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default Categories
