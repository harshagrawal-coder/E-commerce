import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderTree, Layers, Store, Package, Boxes, SlidersHorizontal, ListChecks } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import api from '../../services/api'

const statCards = [
  { key: 'categories', label: 'Categories', icon: FolderTree, to: '/admin/categories', color: 'bg-blue-50 text-blue-600' },
  { key: 'subCategories', label: 'Sub Categories', icon: Layers, to: '/admin/subcategories', color: 'bg-cyan-50 text-cyan-600' },
  { key: 'brands', label: 'Brands', icon: Store, to: '/admin/brands', color: 'bg-violet-50 text-violet-600' },
  { key: 'products', label: 'Products', icon: Package, to: '/admin/products', color: 'bg-amber-50 text-amber-600' },
  { key: 'variants', label: 'Variants', icon: Boxes, to: '/admin/variants', color: 'bg-green-50 text-green-600' },
  { key: 'attributes', label: 'Attributes', icon: SlidersHorizontal, to: '/admin/attributes', color: 'bg-rose-50 text-rose-600' },
  { key: 'attributeValues', label: 'Attribute Values', icon: ListChecks, to: '/admin/attribute-values', color: 'bg-indigo-50 text-indigo-600' },
]

function Dashboard() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [categories, subCategories, brands, products, variants, attributes, attributeValues] =
          await Promise.all([
            api('/category'),
            api('/subcategory'),
            api('/brand'),
            api('/product'),
            api('/variant'),
            api('/attribute'),
            api('/attribute-value'),
          ])
        setCounts({
          categories: categories.data?.length ?? 0,
          subCategories: subCategories.data?.length ?? 0,
          brands: brands.data?.length ?? 0,
          products: products.data?.length ?? 0,
          variants: variants.data?.length ?? 0,
          attributes: attributes.data?.length ?? 0,
          attributeValues: attributeValues.data?.length ?? 0,
        })
      } catch {
        setCounts({})
      } finally {
        setLoading(false)
      }
    }
    loadCounts()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your store's master data"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.key}
              to={card.to}
              className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
                  <Icon size={22} />
                </div>
                {loading ? (
                  <span className="h-5 w-12 animate-pulse rounded bg-surface" />
                ) : (
                  <span className="text-2xl font-bold text-ink">{counts[card.key] ?? 0}</span>
                )}
              </div>
              <p className="mt-4 text-sm font-medium text-ink-muted group-hover:text-ink transition-colors duration-200">
                {card.label}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-ink">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {statCards.map((card) => (
            <Link
              key={card.key}
              to={card.to}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-primary/40 hover:bg-primary-50 hover:text-primary-600"
            >
              <card.icon size={16} />
              Manage {card.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
