import { Pencil, Trash2, Boxes, Plus } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";
import { TableSkeleton } from "../ui/Skeleton";
import Button from "../ui/Button";
import { formatINR, formatNumber } from "../../utils/format";
import { colorHex } from "../../utils/colorValue";

function stockMeta(variant) {
  const stock = Number(variant.stock ?? 0);
  const threshold = Number(variant.lowStockThreshold ?? 5);
  if (stock === 0) return { label: "Out of Stock", status: "outOfStock" };
  if (stock <= threshold) return { label: "Low Stock", status: "lowStock" };
  return { label: "In Stock", status: "inStock" };
}

function VariantImage({ variant }) {
  const src = variant.images?.[0]?.url;
  if (!src) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-surface to-primary-50 text-ink-muted shadow-card">
        <Boxes size={18} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border shadow-card">
      <img
        src={src}
        alt={variant.sku}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

function AttributeBadges({ variant }) {
  const attributes = variant.attributes || [];
  if (!attributes.length) {
    return <span className="text-sm text-ink-muted/50">—</span>;
  }
  return (
    <div className="flex max-w-xs flex-wrap gap-1.5">
      {attributes.map((a, i) => {
        const name = a.attribute?.name ?? a.attribute;
        const rawValue = a.value?.value ?? a.value;
        const hex = colorHex(rawValue);
        const isColorLike =
          hex !== null || String(name).toLowerCase().includes("color");
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary-50/80 px-2 py-1 text-xs font-medium text-primary-700 shadow-card"
          >
            {isColorLike && (
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: hex || "#cbd5e1" }}
                aria-hidden="true"
              />
            )}
            {rawValue}
          </span>
        );
      })}
    </div>
  );
}

function VariantTable({
  variants = [],
  loading,
  onEdit,
  onDelete,
  onAddFirst,
}) {
  if (loading) return <TableSkeleton columns={8} rows={5} />;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      {variants.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No variants yet"
          description="Create variants for different attributes like color, size, storage or RAM. Each variant has its own SKU, price and stock."
          action={
            onAddFirst && (
              <Button onClick={onAddFirst}>
                <Plus size={16} />
                Add first variant
              </Button>
            )
          }
        />
      ) : (
        <div className="max-h-[calc(100vh-24rem)] overflow-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-border bg-surface/95 shadow-[0_1px_0_0_rgba(16,24,40,0.05)] backdrop-blur-sm">
                {[
                  "Image",
                  "SKU",
                  "Attributes",
                  "Selling Price",
                  "MRP",
                  "Stock",
                  "Status",
                  "Default",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => {
                const stock = stockMeta(variant);
                return (
                  <tr
                    key={variant._id}
                    className="group border-b border-border transition-all duration-200 last:border-0 hover:bg-primary-50/30 hover:shadow-[inset_2px_0_0_0_rgba(37,99,235,0.35)]"
                  >
                    <td className="px-5 py-4">
                      <VariantImage variant={variant} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-semibold text-ink">
                        {variant.sku}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <AttributeBadges variant={variant} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-ink">
                        {formatINR(variant.price)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-ink-muted">
                        {variant.mrp ? formatINR(variant.mrp) : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink">
                          {formatNumber(variant.stock)}
                        </span>
                        <StatusBadge
                          status={stock.status}
                          label={stock.label}
                          className="px-2 py-0.5"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={variant.isActive ? "active" : "inactive"}
                      >
                        {variant.isActive ? "Active" : "Inactive"}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4">
                      {variant.isDefault ? (
                        <StatusBadge status="default" label="Default" />
                      ) : (
                        <span className="text-xs text-ink-muted/50">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-0.5">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.88 }}
                          onClick={() => onEdit?.(variant)}
                          aria-label="Edit variant"
                          title="Edit"
                          className="rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-primary-50 hover:text-primary"
                        >
                          <Pencil size={16} />
                        </motion.button>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.88 }}
                          onClick={() => onDelete?.(variant)}
                          aria-label="Delete variant"
                          title="Delete"
                          className="rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VariantTable;
