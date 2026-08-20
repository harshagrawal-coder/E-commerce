import { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Boxes,
  ChevronRight,
  Info,
  Images,
  Star,
  Calendar,
  Store,
  FolderTree,
  Layers,
  LayoutGrid,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";
import VariantTable from "./VariantTable";
import { formatDate, getName } from "../../utils/format";

function ProductHeader({ product, onEdit, onDelete, onAddVariant, onStatusChange }) {
  const image = product.images?.[0]?.url;
  const status = product.status || "pending";
  return (
    <div className="glass-card relative overflow-hidden rounded-3xl shadow-float">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-100/40 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="flex items-center gap-5">
          {image ? (
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/70 shadow-raised">
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-primary-100 text-primary">
              <Boxes size={32} strokeWidth={1.5} />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-ink">{product.name}</h1>
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                  <Star size={12} fill="currentColor" />
                  Featured
                </span>
              )}
              <StatusBadge status={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </StatusBadge>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
              {product.vendor?.businessName && (
                <>
                  <span className="inline-flex items-center gap-1 font-semibold text-ink">
                    <Store size={14} />
                    {product.vendor.businessName}
                  </span>
                  <ChevronRight size={13} className="text-ink-light" />
                </>
              )}
              <span className="font-semibold text-ink">{getName(product.brand) || "—"}</span>
              <ChevronRight size={13} className="text-ink-light" />
              <span>{getName(product.category) || "—"}</span>
              <ChevronRight size={13} className="text-ink-light" />
              <span>{getName(product.subCategory) || "—"}</span>
            </div>
            <p className="mt-2 text-xs text-ink-muted">
              Added {formatDate(product.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {onStatusChange && (
            <>
              {status !== "approved" && (
                <Button size="sm" variant="primary" onClick={() => onStatusChange("approved")}>
                  <Check size={16} />
                  Approve
                </Button>
              )}
              {status !== "rejected" && (
                <Button size="sm" variant="danger" onClick={() => onStatusChange("rejected")}>
                  <X size={16} />
                  Reject
                </Button>
              )}
            </>
          )}
          <Button variant="secondary" onClick={onEdit}>
            <Pencil size={16} />
            Edit Product
          </Button>
          <Button variant="danger" onClick={onDelete}>
            <Trash2 size={16} />
            Delete
          </Button>
          <Button onClick={onAddVariant}>
            <Plus size={16} />
            Add Variant
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-surface to-primary-50 text-ink-muted">
        <Icon size={15} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
        <p className={`mt-0.5 text-sm text-ink ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function ProductInformation({ product }) {
  return (
    <Card title="Product Information" description="Core details about this product" icon={Info} className="h-full">
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <InfoRow icon={Store} label="Vendor" value={product.vendor?.businessName || "-"} />
        <InfoRow icon={Store} label="Brand" value={getName(product.brand, "-")} />
        <InfoRow icon={FolderTree} label="Category" value={getName(product.category, "-")} />
        <InfoRow icon={Layers} label="Sub Category" value={getName(product.subCategory, "-")} />
        <InfoRow icon={Calendar} label="Created" value={formatDate(product.createdAt)} />
        <div className="sm:col-span-2">
          <div className="border-t border-border/70" />
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Description</p>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink">
            {product.description || "-"}
          </p>
        </div>
      </div>
    </Card>
  );
}

function ImageGallery({ images }) {
  if (!images?.length) {
    return (
      <Card title="Images" description="Product gallery" icon={Images} className="h-full">
        <EmptyState
          icon={Images}
          title="No images"
          description="This product has no images yet."
        />
      </Card>
    );
  }
  const [primary, ...rest] = images;
  return (
    <Card title="Images" description={`${images.length} image${images.length > 1 ? "s" : ""}`} icon={Images} className="h-full">
      <div className="space-y-3">
        <div className="group overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          <img
            src={primary.url}
            alt={primary.alt || "Primary image"}
            className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        {rest.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {rest.map((img, i) => (
              <div
                key={img.url || i}
                className="group overflow-hidden rounded-lg border border-border bg-surface"
              >
                <img src={img.url} alt={img.alt || `Image ${i + 2}`} className="h-16 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "variants", label: "Variants", icon: Boxes },
];

function ProductDetails({
  product,
  variants = [],
  variantsLoading,
  onEdit,
  onDelete,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  onStatusChange,
  onApproveVariant,
  onRejectVariant,
}) {
  const [tab, setTab] = useState("overview");
  const variantCount = variants.length;
  const imageCount = product.images?.length || 0;

  return (
    <div className="space-y-6">
      <ProductHeader
        product={product}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddVariant={onAddVariant}
        onStatusChange={onStatusChange}
      />

      {/* Tab bar */}
      <div className="glass flex items-center gap-1 rounded-2xl p-1.5 shadow-card">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          const count = t.key === "variants" ? variantCount : imageCount;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-pressed={active}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active ? "text-primary" : "text-ink-muted hover:text-ink"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="product-tab-pill"
                  className="absolute inset-0 rounded-xl bg-white shadow-card"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold transition-colors duration-200 ${
                    active ? "bg-primary text-white" : "bg-surface text-ink-muted"
                  }`}
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {tab === "overview" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ProductInformation product={product} />
          </div>
          <div className="lg:col-span-2">
            <ImageGallery images={product.images} />
          </div>
        </div>
      ) : (
        <Card
          title="Variants"
          description={`${variantCount} variant${variantCount === 1 ? "" : "s"} for this product`}
          icon={Boxes}
          action={
            <Button size="sm" onClick={onAddVariant}>
              <Plus size={15} />
              Add Variant
            </Button>
          }
          bodyClassName="px-2 py-2 sm:px-3"
        >
          <VariantTable
            variants={variants}
            loading={variantsLoading}
            onEdit={onEditVariant}
            onDelete={onDeleteVariant}
            onAddFirst={onAddVariant}
            onApprove={onApproveVariant}
            onReject={onRejectVariant}
          />
        </Card>
      )}
    </div>
  );
}

export default ProductDetails;
