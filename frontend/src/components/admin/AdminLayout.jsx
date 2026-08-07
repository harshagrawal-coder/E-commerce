import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderTree,
  Layers,
  Store,
  SlidersHorizontal,
  ListChecks,
  Package,
  Boxes,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import BrandLogo from '../auth/BrandLogo'

const navGroups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/categories', label: 'Categories', icon: FolderTree },
      { to: '/admin/subcategories', label: 'Sub Categories', icon: Layers },
      { to: '/admin/brands', label: 'Brands', icon: Store },
    ],
  },
  {
    label: 'Product Setup',
    items: [
      { to: '/admin/attributes', label: 'Attributes', icon: SlidersHorizontal },
      { to: '/admin/attribute-values', label: 'Attribute Values', icon: ListChecks },
    ],
  },
  {
    label: 'Products',
    items: [
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/variants', label: 'Product Variants', icon: Boxes },
    ],
  },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted/70">
            {group.label}
          </p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      [
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-ink-muted hover:bg-surface hover:text-ink',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={18} className={isActive ? 'text-white' : 'text-ink-muted group-hover:text-ink'} />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight size={14} className={isActive ? 'text-white/70' : 'text-ink-muted/40'} />
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <BrandLogo size="sm" />
      </div>
      <NavItems onNavigate={onNavigate} />
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('commercehub_token')
            localStorage.removeItem('commercehub_user')
            navigate('/login')
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-red-600"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  )
}

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-ink"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-ink lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="lg:hidden">
              <BrandLogo size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-muted sm:block">Admin</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              A
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
