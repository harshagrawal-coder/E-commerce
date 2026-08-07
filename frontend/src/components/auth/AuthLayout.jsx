import { Store, ShieldCheck, BarChart3, Package, Truck, Users, ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react'
import BrandLogo from './BrandLogo'

const features = [
  {
    icon: Store,
    title: 'Multi Vendor Marketplace',
    description: 'Onboard and manage multiple vendors seamlessly.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Authentication',
    description: 'Role-based access for admins, vendors and customers.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Inventory Management',
    description: 'Track sales, stock and performance in real time.',
  },
]

function DashboardMockup() {
  const statCards = [
    { label: 'Total Revenue', value: '$128,450', change: '+12.4%', up: true },
    { label: 'Active Vendors', value: '48', change: '+3.1%', up: true },
    { label: 'Orders Today', value: '1,284', change: '-2.6%', up: false },
  ]

  return (
    <div className="w-full max-w-xl rounded-xl border border-border bg-white p-4 shadow-lg shadow-ink/5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-6 w-24 rounded-lg bg-surface" />
          <span className="h-6 w-24 rounded-lg bg-surface" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-white p-3">
            <p className="text-[11px] font-medium text-ink-muted">{card.label}</p>
            <p className="mt-1 text-base font-bold text-ink">{card.value}</p>
            <p className={`mt-1 flex items-center gap-0.5 text-[11px] font-medium ${card.up ? 'text-green-600' : 'text-red-500'}`}>
              <ArrowUpRight size={12} className={card.up ? '' : 'rotate-90'} />
              {card.change}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-3">
        <div className="col-span-3 rounded-xl border border-border bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-ink-muted">Revenue Overview</p>
            <TrendingUp size={14} className="text-primary" />
          </div>
          <div className="mt-3 flex h-24 items-end gap-1.5">
            {[45, 62, 50, 78, 66, 90, 74, 96, 82, 100, 88, 94].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-md bg-primary-100"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="col-span-2 rounded-xl border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-ink-muted">Top Products</p>
          <div className="mt-3 space-y-3">
            {[
              { name: 'Wireless Headphones', sold: '1.2k' },
              { name: 'Smart Watch', sold: '980' },
              { name: 'Laptop Stand', sold: '740' },
            ].map((product) => (
              <div key={product.name} className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-primary-50" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium text-ink">{product.name}</p>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface">
                    <span className="block h-full w-2/3 rounded-full bg-primary" />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-ink-muted">{product.sold}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <ShoppingCart size={16} />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-medium text-ink">Recent Orders</p>
          <p className="text-[11px] text-ink-muted">24 new orders need approval</p>
        </div>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
          Live
        </span>
      </div>
    </div>
  )
}

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left brand panel */}
      <aside className="relative hidden w-[45%] flex-col bg-surface lg:flex">
        <div className="flex h-full flex-col px-12 py-10">
          <BrandLogo size="md" />

          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <div className="flex justify-center">
              <DashboardMockup />
            </div>

            <div className="mt-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-ink">
                Welcome to CommerceHub
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                Manage your products, vendors, orders and customers from one place.
              </p>
            </div>

            <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-border bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <Icon size={18} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ink">{feature.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Users size={14} />
              Trusted by 2,000+ businesses
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Package size={14} />
              Secure &amp; Reliable
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Truck size={14} />
              Fast Delivery
            </div>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-surface px-4 py-10 lg:w-[55%]">
        <div className="mb-8 flex w-full max-w-[430px] lg:hidden">
          <BrandLogo size="sm" />
        </div>
        <div className="w-full max-w-[430px]">{children}</div>
      </main>
    </div>
  )
}

export default AuthLayout
