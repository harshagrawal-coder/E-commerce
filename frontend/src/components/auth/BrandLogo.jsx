import { Store } from 'lucide-react'

function BrandLogo({ size = 'md', className = '', light = false }) {
  const box = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-10 w-10 rounded-xl',
    lg: 'h-12 w-12 rounded-xl',
  }
  const icon = {
    sm: 16,
    md: 20,
    lg: 24,
  }
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${box[size]} flex items-center justify-center bg-primary text-white shadow-sm`}>
        <Store size={icon[size]} aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className={`text-base font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
          CommerceHub
        </p>
        <p className={`text-xs ${light ? 'text-white/70' : 'text-ink-muted'}`}>Admin Panel</p>
      </div>
    </div>
  )
}

export default BrandLogo
