import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Package, Boxes, Store, Check, X, Search, Clock } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorAlert from "../../components/ui/ErrorAlert";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/Skeleton";
import {
  fetchAllPendingVariantsData,
  updateVariantStatusData,
} from "../../store/slices/variant.slice";
import {
  formatINR,
  formatNumber,
  formatDate,
  getName,
} from "../../utils/format";
import { colorHex } from "../../utils/colorValue";
import { showToast } from "../../utils/toast";

function PendingVariantRow({ variant, onApprove, onReject }) {
  const product = variant.product || {};
  const vendor = product.vendor || {};
  const vendorUser = vendor.user || {};
  const attributes = variant.attributes || [];
  const image = variant.images?.[0]?.url || product.images?.[0]?.url;
  return (
    <tr className="group border-b border-border transition-all duration-200 last:border-0 hover:bg-primary-50/30 hover:shadow-[inset_2px_0_0_0_rgba(37,99,235,0.35)]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {image ? (
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border shadow-card">
              <img
                src={image}
                alt={variant.sku}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-surface to-primary-50 text-ink-muted shadow-card">
              <Boxes size={18} strokeWidth={1.5} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {product.name || "—"}
            </p>
            <p className="truncate font-mono text-xs text-ink-muted">
              {variant.sku}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex max-w-xs flex-wrap gap-1.5">
          {attributes.length === 0 && (
            <span className="text-sm text-ink-muted/50">—</span>
          )}
          {attributes.map((a, i) => {
            const rawValue = a.value?.value ?? a.value;
            const hex = colorHex(rawValue);
            return (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary-50/80 px-2 py-1 text-xs font-medium text-primary-700 shadow-card"
              >
                {hex && (
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: hex }}
                    aria-hidden="true"
                  />
                )}
                {rawValue}
              </span>
            );
          })}
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Store size={14} className="text-ink-light" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">
              {vendor.businessName || "—"}
            </p>
            <p className="truncate text-xs text-ink-muted">
              {vendorUser.name || vendorUser.email || "—"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="font-semibold text-ink">
          {formatINR(variant.price)}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="font-medium text-ink">
          {formatNumber(variant.stock)}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="text-ink-muted">{formatDate(variant.createdAt)}</span>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={variant.status || "pending"}>
          {getName(variant.status, "pending")}
        </StatusBadge>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onApprove(variant)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition-colors duration-200 hover:bg-emerald-100"
          >
            <Check size={14} />
            Approve
          </button>
          <button
            type="button"
            onClick={() => onReject(variant)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors duration-200 hover:bg-red-100"
          >
            <X size={14} />
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
}

function PendingVariants() {
  const dispatch = useDispatch();
  const { pendingData, loading, updating, error } = useSelector(
    (state) => state.variant,
  );

  const [search, setSearch] = useState("");
  const [statusTarget, setStatusTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPendingVariantsData());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return pendingData;
    return pendingData.filter((v) => {
      const product = v.product || {};
      const vendor = product.vendor || {};
      const haystack = [
        v.sku,
        product.name,
        vendor.businessName,
        (v.attributes || []).map((a) => a.value?.value ?? a.value).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [pendingData, search]);

  const handleStatusChange = async () => {
    if (!statusTarget) return;
    try {
      await dispatch(
        updateVariantStatusData({
          id: statusTarget._id,
          data: { status: statusTarget.status },
        }),
      ).unwrap();
      await dispatch(fetchAllPendingVariantsData()).unwrap();
      setStatusTarget(null);
      showToast(
        statusTarget.status === "approved"
          ? `Variant "${statusTarget.sku}" approved`
          : `Variant "${statusTarget.sku}" rejected`,
      );
    } catch (err) {
      showToast(err || "Failed to update variant status", "error");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Pending Variants"
          description="Review variants submitted by vendors. Approve or reject them before they go live."
          actions={
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <Clock size={14} />
              {pendingData.length} pending
            </span>
          }
        />

        <ErrorAlert message={error} />

        <div className="glass-card relative overflow-hidden rounded-2xl p-4 shadow-float">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent"
            aria-hidden="true"
          />
          <Input
            id="pending-variant-search"
            icon={<Search size={15} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, product or vendor…"
          />
        </div>

        <Card
          title="Variants awaiting approval"
          description="Submissions from vendors that need admin review"
          icon={Boxes}
          bodyClassName="px-2 py-2 sm:px-3"
        >
          {loading ? (
            <TableSkeleton columns={8} rows={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Package}
              title={search ? "No matching variants" : "All caught up"}
              description={
                search
                  ? "No pending variants match your search."
                  : "There are no variants waiting for approval right now."
              }
            />
          ) : (
            <div className="max-h-[calc(100vh-24rem)] overflow-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-border bg-surface/95 shadow-[0_1px_0_0_rgba(16,24,40,0.05)] backdrop-blur-sm">
                    {[
                      "Product / SKU",
                      "Attributes",
                      "Vendor",
                      "Selling Price",
                      "Stock",
                      "Created",
                      "Status",
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
                  {filtered.map((variant) => (
                    <PendingVariantRow
                      key={variant._id}
                      variant={variant}
                      onApprove={(v) =>
                        setStatusTarget({ ...v, status: "approved" })
                      }
                      onReject={(v) =>
                        setStatusTarget({ ...v, status: "rejected" })
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <ConfirmDialog
          open={!!statusTarget}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleStatusChange}
          loading={updating}
          title={
            statusTarget?.status === "approved"
              ? "Approve variant"
              : "Reject variant"
          }
          message={
            statusTarget?.status === "approved"
              ? `Are you sure you want to approve variant "${statusTarget?.sku}"? It will become visible on the storefront.`
              : `Are you sure you want to reject variant "${statusTarget?.sku}"? The vendor will be able to edit it and resubmit.`
          }
          confirmLabel={
            statusTarget?.status === "approved" ? "Approve" : "Reject"
          }
          loadingLabel={
            statusTarget?.status === "approved"
              ? "Approving..."
              : "Rejecting..."
          }
          confirmIcon={statusTarget?.status === "approved" ? Check : X}
          confirmVariant={
            statusTarget?.status === "approved" ? "primary" : "danger"
          }
        />
      </div>
    </PageTransition>
  );
}

export default PendingVariants;
