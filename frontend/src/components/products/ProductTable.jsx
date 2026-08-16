import { Eye, Pencil, Trash2, Boxes, Package, Star, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";
import { TableSkeleton } from "../ui/Skeleton";
import { formatDate, getName } from "../../utils/format";

function ProductImage({ product }) {
  const src = product.images?.[0]?.url;
  if (!src) {
    return (
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface to-primary-50 text-ink-muted shadow-card">
        <Package size={18} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border shadow-card">
      <img
        src={src}
        alt={product.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

function ActionButton({ icon: Icon, onClick, label, tone = "default", title }) {
  const tones = {
    default: "hover:bg-primary-50 hover:text-primary",
    success: "hover:bg-emerald-50 hover:text-emerald-600",
    danger: "hover:bg-red-50 hover:text-red-600",
  };
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      title={title}
      aria-label={label}
      className={`rounded-lg p-2 text-ink-muted transition-colors duration-200 ${tones[tone] || tones.default}`}
    >
      <Icon size={16} />
    </motion.button>
  );
}

function ProductTable({ products = [], loading, onView, onEdit, onDelete, onManageVariants, onApprove, onReject }) {
  if (loading) return <TableSkeleton columns={9} rows={6} />;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your filters, or create your first product to get started."
        />
      ) : (
        <div className="max-h-[calc(100vh-24rem)] overflow-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-border bg-surface/95 shadow-[0_1px_0_0_rgba(16,24,40,0.05)] backdrop-blur-sm">
                {["Product", "Category", "Brand", "Variants", "Approval", "Featured", "Created"].map((h) => (
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
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="group border-b border-border transition-all duration-200 last:border-0 hover:bg-primary-50/30 hover:shadow-[inset_2px_0_0_0_rgba(37,99,235,0.35)]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <ProductImage product={product} />
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onView?.(product)}
                          className="block max-w-[220px] truncate text-left text-sm font-semibold text-ink transition-colors hover:text-primary"
                        >
                          {product.name}
                        </button>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {getName(product.subCategory) || "No sub-category"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-ink">{getName(product.category) || "-"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-ink">{getName(product.brand) || "-"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary shadow-card">
                      <Boxes size={12} />
                      {(product.variants?.length || 0)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={product.status || "pending"}>
                      {(product.status || "pending").charAt(0).toUpperCase() + (product.status || "pending").slice(1)}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-4">
                    {product.isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-medium text-amber-600">Featured</span>
                      </span>
                    ) : (
                      <span className="text-xs text-ink-muted/50">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-ink-muted">{formatDate(product.createdAt)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-0.5">
                      {(onApprove || onReject) && product.status !== "approved" && onApprove && (
                        <ActionButton
                          icon={Check}
                          onClick={() => onApprove(product)}
                          label="Approve product"
                          title="Approve"
                          tone="success"
                        />
                      )}
                      {(onApprove || onReject) && product.status !== "rejected" && onReject && (
                        <ActionButton
                          icon={X}
                          onClick={() => onReject(product)}
                          label="Reject product"
                          title="Reject"
                          tone="danger"
                        />
                      )}
                      <ActionButton
                        icon={Eye}
                        onClick={() => onView?.(product)}
                        label="View product"
                        title="View"
                      />
                      <ActionButton
                        icon={Pencil}
                        onClick={() => onEdit?.(product)}
                        label="Edit product"
                        title="Edit"
                      />
                      <ActionButton
                        icon={Boxes}
                        onClick={() => onManageVariants?.(product)}
                        label="Manage variants"
                        title="Manage Variants"
                      />
                      <ActionButton
                        icon={Trash2}
                        onClick={() => onDelete?.(product)}
                        label="Delete product"
                        title="Delete"
                        tone="danger"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductTable;
