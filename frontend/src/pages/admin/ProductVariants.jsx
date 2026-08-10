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


const emptyForm = { productId: '', sku: '', price: 0, stock: 0, isDefault: false, isActive: true, attributesJson: '[]' }

function ProductVariants() {
  const rows = []
  const products = []
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
      productId: row.product ?? '',
      sku: row.sku || '',
      price: row.price ?? 0,
      stock: row.stock ?? 0,
      isDefault: row.isDefault ?? false,
      isActive: row.isActive ?? true,
      attributesJson: JSON.stringify(row.attributes || [], null, 2),
    })
    setError('')
    setModalOpen(true)
  }

    const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.productId) {
      setError('Product is required')
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

  const productOptions = products.map((p) => ({ value: p._id, label: p.name }))

  const columns = [
    { key: 'sku', header: 'SKU', render: (row) => <span className="font-mono text-sm font-medium text-ink">{row.sku}</span> },
    { key: 'productName', header: 'Product', render: (row) => <span className="text-ink-muted">{row.productName || '-'}</span> },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span className="font-medium text-ink">${Number(row.price || 0).toFixed(2)}</span>,
    },
    { key: 'stock', header: 'Stock', render: (row) => <span className="text-ink-muted">{row.stock ?? 0}</span> },
    {
      key: 'attributes',
      header: 'Attributes',
      render: (row) => {
        if (!row.attributes?.length) return <span className="text-ink-muted">-</span>
        return (
          <div className="flex max-w-xs flex-wrap gap-1">
            {row.attributes.map((a, i) => (
              <Badge key={i} tone="blue">
                {a.attribute?.name ?? a.attribute}: {a.value?.value ?? a.value}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      key: 'flags',
      header: 'Flags',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.isDefault && <Badge tone="amber">Default</Badge>}
          {row.isActive ? <Badge tone="green">Active</Badge> : <Badge tone="red">Inactive</Badge>}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Variants"
        description="Manage variants for products"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Variant
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
        emptyMessage="No variants yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Variant' : 'Add Variant'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="variant-form" loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <form id="variant-form" onSubmit={handleSubmit} className="space-y-5">
          <Select
            id="productId"
            label="Product"
            value={form.productId}
            onChange={(e) => setForm((p) => ({ ...p, productId: e.target.value }))}
            options={productOptions}
            placeholder="Select a product"
            required
            disabled={!!editing}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              id="sku"
              label="SKU"
              value={form.sku}
              onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
              placeholder="HD-BLACK-XL"
              required
            />
            <Input
              id="price"
              label="Price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              required
            />
            <Input
              id="stock"
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="attributesJson" className="mb-2 block text-sm font-medium text-ink">
              Attributes (JSON array)
            </label>
            <textarea
              id="attributesJson"
              rows={4}
              value={form.attributesJson}
              onChange={(e) => setForm((p) => ({ ...p, attributesJson: e.target.value }))}
              placeholder='[{"attribute":"<attributeId>","value":"<attributeValueId>"}]'
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 font-mono text-xs text-ink shadow-sm transition-colors duration-200 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/25"
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              Each entry: attribute (id) and value (id).
            </p>
          </div>

          <div className="space-y-3">
            <Checkbox
              id="isDefault"
              checked={form.isDefault}
              onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
              label="Default variant"
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
        title="Delete variant"
        message={`Are you sure you want to delete variant "${deleteTarget?.sku}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default ProductVariants
