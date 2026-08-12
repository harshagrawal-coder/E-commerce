import { Activity } from "lucide-react";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";

function stockStatus(stock, threshold) {
  const s = Number(stock || 0);
  const t = Number(threshold ?? 5);
  if (s === 0) return { label: "Out of Stock", status: "outOfStock" };
  if (s <= t) return { label: "Low Stock", status: "lowStock" };
  return { label: "In Stock", status: "inStock" };
}

function InventoryCard({ stock, lowStockThreshold, onChange, errors = {} }) {
  const status = stockStatus(stock, lowStockThreshold);

  return (
    <Card
      title="Inventory"
      description="Track stock quantity and alerts"
      icon={Activity}
      className="h-full"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="stock" className="mb-2 block text-sm font-medium text-ink">
            Stock Quantity
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => onChange("stock", e.target.value)}
            placeholder="0"
            className={[
              "h-11 w-full rounded-xl border bg-white/90 px-3.5 text-sm text-ink",
              "shadow-card transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-0",
              errors.stock
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/15",
            ].join(" ")}
          />
          {errors.stock && <p className="mt-1.5 text-xs text-red-600">{errors.stock}</p>}
        </div>
        <div>
          <label htmlFor="lowStockThreshold" className="mb-2 block text-sm font-medium text-ink">
            Low Stock Threshold
          </label>
          <input
            id="lowStockThreshold"
            type="number"
            min="0"
            step="1"
            value={lowStockThreshold}
            onChange={(e) => onChange("lowStockThreshold", e.target.value)}
            placeholder="5"
            className={[
              "h-11 w-full rounded-xl border bg-white/90 px-3.5 text-sm text-ink",
              "shadow-card transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-0",
              "border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/15",
            ].join(" ")}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3.5">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Live status</span>
        <StatusBadge status={status.status} label={status.label} />
      </div>
    </Card>
  );
}

export default InventoryCard;
