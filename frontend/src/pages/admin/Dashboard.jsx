import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderTree, Layers, Store, Package, Boxes, SlidersHorizontal, ListChecks, ArrowUpRight } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { fetchCategory } from '../../store/slices/categorySlice'
import { fetchSubCategoryData } from '../../store/slices/subCategorySlice'
import { fetchbrandData } from '../../store/slices/brand.slice'
import { fetchProductData } from '../../store/slices/product.slice'
import { fetchAttributeData } from '../../store/slices/attibute.slice'
import { fetchAttributeValueData } from '../../store/slices/attributeValue.slice'

const statCards = [
  { key: 'categories', label: 'Categories', icon: FolderTree, to: '/admin/categories', color: 'text-blue-600', tile: 'from-blue-50 to-blue-100' },
  { key: 'subCategories', label: 'Sub Categories', icon: Layers, to: '/admin/subcategories', color: 'text-cyan-600', tile: 'from-cyan-50 to-cyan-100' },
  { key: 'brands', label: 'Brands', icon: Store, to: '/admin/brands', color: 'text-violet-600', tile: 'from-violet-50 to-violet-100' },
  { key: 'products', label: 'Products', icon: Package, to: '/admin/products', color: 'text-amber-600', tile: 'from-amber-50 to-amber-100' },
  { key: 'variants', label: 'Variants', icon: Boxes, to: '/admin/products', color: 'text-green-600', tile: 'from-green-50 to-green-100' },
  { key: 'attributes', label: 'Attributes', icon: SlidersHorizontal, to: '/admin/attributes', color: 'text-rose-600', tile: 'from-rose-50 to-rose-100' },
  { key: 'attributeValues', label: 'Attribute Values', icon: ListChecks, to: '/admin/attribute-values', color: 'text-indigo-600', tile: 'from-indigo-50 to-indigo-100' },
]

function Dashboard() {
  const dispatch = useDispatch()
  const category = useSelector((state) => state.category)
  const subCategory = useSelector((state) => state.subCategory)
  const brand = useSelector((state) => state.brand)
  const product = useSelector((state) => state.product)
  const attribute = useSelector((state) => state.attribute)
  const attributeValue = useSelector((state) => state.attributeValue)

  useEffect(() => {
    if (category.data.length === 0) dispatch(fetchCategory())
    if (subCategory.data.length === 0) dispatch(fetchSubCategoryData())
    if (brand.data.length === 0) dispatch(fetchbrandData())
    if (product.data.length === 0) dispatch(fetchProductData())
    if (attribute.data.length === 0) dispatch(fetchAttributeData())
    if (attributeValue.data.length === 0) dispatch(fetchAttributeValueData({ limit: 100 }))
  }, [dispatch, category.data.length, subCategory.data.length, brand.data.length, product.data.length, attribute.data.length, attributeValue.data.length])

  const counts = {
    categories: category.data.length,
    subCategories: subCategory.data.length,
    brands: brand.data.length,
    products: product.data.length,
    variants: product.data.reduce(
      (sum, p) => sum + (p.variantsCount ?? p.variants?.length ?? 0),
      0,
    ),
    attributes: attribute.data.length,
    attributeValues: attributeValue.data.length,
  }

  const loading = category.loading || subCategory.loading || brand.loading || product.loading || attribute.loading || attributeValue.loading

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
            <motion.div
              key={card.key}
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Link
                to={card.to}
                className="glass-card group relative block overflow-hidden rounded-2xl p-5 shadow-card transition-shadow duration-300 hover:shadow-raised"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary-100/40 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-card ${card.tile} ${card.color}`}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {loading ? (
                      <span className="h-5 w-12 animate-pulse rounded bg-surface" />
                    ) : (
                      <span className="text-2xl font-bold text-ink">{counts[card.key]}</span>
                    )}
                    <ArrowUpRight
                      size={16}
                      className="text-ink-light opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100"
                    />
                  </div>
                </div>
                <p className="relative mt-4 text-sm font-medium text-ink-muted transition-colors duration-200 group-hover:text-ink">
                  {card.label}
                </p>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="glass-card relative overflow-hidden rounded-2xl p-6 shadow-card">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent"
          aria-hidden="true"
        />
        <h2 className="text-base font-semibold text-ink">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {statCards.map((card) => (
            <Link
              key={card.key}
              to={card.to}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/70 px-4 py-2.5 text-sm font-medium text-ink shadow-card transition-all duration-200 hover:border-primary/40 hover:bg-white hover:text-primary-600 hover:shadow-raised"
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