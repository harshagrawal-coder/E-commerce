import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Checkbox from '../../components/ui/Checkbox'
import Badge from '../../components/ui/Badge'
import ImageUpload from '../../components/ui/ImageUpload'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorAlert from '../../components/ui/ErrorAlert'

const emptyForm = {
  name: '',
  description: '',
  category: '',
  subCategory: '',
  brand: '',
  isActive: true,
  isFeatured: false,
  variantsJson: '[]',
}

function PreviewImage({ file, onRemove, index }) {
  const url = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => () => URL.revokeObjectURL(url), [url])

  return (
    <div className="relative">
      <img
        src={url}
        alt={`Product ${index + 1}`}
        className="h-20 w-20 rounded-xl border border-border object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1.5 -top-1.5 rounded-full bg-red-600 p-0.5 text-white"
        aria-label="Remove image"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function Products() {
  const rows = []
  const categories = []
  const subCategories = []
  const brands = []
  const loading = false
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setImages([])
    setError('')
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({
      name: row.name || '',
      description: row.description || '',
      category: row.category?._id ?? row.category ?? '',
      subCategory: row.subCategory?._id ?? row.subCategory ?? '',
      brand: row.brand?._id ?? row.brand ?? '',
      isActive: row.isActive ?? true,
      isFeatured: row.isFeatured ?? false,
      variantsJson: JSON.stringify(row.variants || [], null, 2),
    })
    setImages([])
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.category || !form.subCategory || !form.brand) {
      setError('Category, sub category and brand are required')
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

  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }))
  const subCategoryOptions = subCategories.map((s) => ({ value: s._id, label: s.name }))
  const brandOptions = brands.map((b) => ({ value: b._id, label: b.name }))

  const columns = [
    {
      key: 'images',
      header: 'Image',
      render: (row) =>
        row.images?.[0]?.url ? (
          <img src={row.images[0].url} alt={row.name} className="h-10 w-10 rounded-lg border border-border object-cover" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-xs text-ink-muted">
            -
          </span>
        ),
    },
    { key: 'name', header: 'Name', render: (row) => <span className="font-medium text-ink">{row.name}</span> },
    {
      key: 'category',
      header: 'Category',
      render: (row) => <span className="text-ink-muted">{row.category?.name ?? row.category ?? '-'}</span>,
    },
    {
      key: 'subCategory',
      header: 'Sub Category',
      render: (row) => <span className="text-ink-muted">{row.subCategory?.name ?? row.subCategory ?? '-'}</span>,
    },
    {
      key: 'brand',
      header: 'Brand',
      render: (row) => <span className="text-ink-muted">{row.brand?.name ?? row.brand ?? '-'}</span>,
    },
    {
      key: 'flags',
      header: 'Flags',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.isFeatured && <Badge tone="amber">Featured</Badge>}
          {row.isActive ? <Badge tone="green">Active</Badge> : <Badge tone="red">Inactive</Badge>}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage products"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Product
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
        emptyMessage="No products yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Product' : 'Add Product'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="product-form" loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Wireless Headphones"
            required
          />
          <Input
            id="description"
            label="Description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Product description"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              id="category"
              label="Category"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              options={categoryOptions}
              placeholder="Select category"
              required
            />
            <Select
              id="subCategory"
              label="Sub Category"
              value={form.subCategory}
              onChange={(e) => setForm((p) => ({ ...p, subCategory: e.target.value }))}
              options={subCategoryOptions}
              placeholder="Select sub category"
              required
            />
            <Select
              id="brand"
              label="Brand"
              value={form.brand}
              onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
              options={brandOptions}
              placeholder="Select brand"
              required
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-ink">Images</span>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <PreviewImage key={i} file={img} onRemove={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} index={i} />
              ))}
              {images.length < 6 && (
                <ImageUpload label="" value={null} onChange={(f) => f && setImages((prev) => [...prev, f])} />
              )}
            </div>
          </div>

          <div>
            <label htmlFor="variantsJson" className="mb-2 block text-sm font-medium text-ink">
              Variants (JSON array)
            </label>
            <textarea
              id="variantsJson"
              rows={6}
              value={form.variantsJson}
              onChange={(e) => setForm((p) => ({ ...p, variantsJson: e.target.value }))}
              placeholder='[{"sku":"HD-01","price":99,"stock":10,"attributes":[]}]'
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 font-mono text-xs text-ink shadow-sm transition-colors duration-200 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/25"
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              Optional. Each variant: sku, price, stock, attributes, isDefault, isActive.
            </p>
          </div>

          <div className="space-y-3">
            <Checkbox
              id="isFeatured"
              checked={form.isFeatured}
              onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
              label="Featured"
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
        title="Delete product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Its variants will also be deleted.`}
      />
    </div>
  )
}

export default Products
