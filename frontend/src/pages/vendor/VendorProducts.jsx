import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FilterX, Package } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorAlert from "../../components/ui/ErrorAlert";
import ProductTable from "../../components/products/ProductTable";
import {
  fetchVendorProductData,
  deleteVendorProductData,
  clearError,
} from "../../store/slices/vendorProduct.slice";
import { showToast } from "../../utils/toast";

const emptyFilters = { search: "", status: "" };

function VendorProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: products, loading, saving, error } = useSelector(
    (state) => state.vendorProduct,
  );

  const [filters, setFilters] = useState(emptyFilters);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchVendorProductData());
    return () => dispatch(clearError());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return products.filter((p) => {
      if (query) {
        const haystack = [
          p.name,
          p.brand?.name ?? p.brand,
          p.category?.name ?? p.category,
          p.subCategory?.name ?? p.subCategory,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filters.status && p.status !== filters.status) return false;
      return true;
    });
  }, [products, filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteVendorProductData(deleteTarget._id)).unwrap();
      setDeleteTarget(null);
      showToast(`"${deleteTarget.name}" deleted`);
    } catch (err) {
      showToast(err || "Failed to delete product", "error");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="My Products"
          description="Manage the products in your store. Only your own products are shown here."
          actions={
            <Button onClick={() => navigate("/vendor/products/new")}>
              <Plus size={16} />
              Add Product
            </Button>
          }
        />

        <ErrorAlert message={error} />

        <div className="glass-card relative overflow-hidden rounded-2xl p-4 shadow-float">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <Input
                id="vendor-product-search"
                icon={<Search size={15} />}
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Search your products…"
                containerClassName="h-full"
              />
            </div>
            <Select
              id="vendor-product-status"
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "draft", label: "Draft" },
              ]}
              placeholder="All approval statuses"
            />
          </div>
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between border-t border-white/60 pt-3">
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Package size={13} />
                {filteredProducts.length} result
                {filteredProducts.length === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-50 hover:text-primary-700"
              >
                <FilterX size={13} />
                Clear filters
              </button>
            </div>
          )}
        </div>

        <ProductTable
          products={filteredProducts}
          loading={loading}
          onView={(p) => navigate(`/vendor/products/${p._id}/edit`)}
          onEdit={(p) => navigate(`/vendor/products/${p._id}/edit`)}
          onDelete={setDeleteTarget}
        />

        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={saving}
          title="Delete product"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? Its variants and images will also be deleted. This cannot be undone.`}
        />
      </div>
    </PageTransition>
  );
}

export default VendorProducts;