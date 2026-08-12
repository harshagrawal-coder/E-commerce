import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FilterX, Package } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorAlert from "../../components/ui/ErrorAlert";
import ProductTable from "../../components/products/ProductTable";
import PageTransition from "../../components/ui/PageTransition";
import {
  fetchProductData,
  deleteProductData,
  clearError,
} from "../../store/slices/product.slice";
import { fetchCategory } from "../../store/slices/categorySlice";
import { fetchSubCategoryData } from "../../store/slices/subCategorySlice";
import { fetchbrandData } from "../../store/slices/brand.slice";
import { showToast } from "../../utils/toast";

const emptyFilters = { search: "", category: "", subCategory: "", brand: "", status: "" };

function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: products, loading, error: storeError } = useSelector((state) => state.product);
  const { data: categories } = useSelector((state) => state.category);
  const { data: subCategories } = useSelector((state) => state.subCategory);
  const { data: brands } = useSelector((state) => state.brand);

  const [filters, setFilters] = useState(emptyFilters);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProductData());
    dispatch(fetchCategory());
    dispatch(fetchSubCategoryData());
    dispatch(fetchbrandData());
    return () => dispatch(clearError());
  }, [dispatch]);

  const filteredSubCategories = useMemo(
    () => subCategories.filter((s) => (s.category?._id ?? s.category) === filters.category),
    [subCategories, filters.category],
  );

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
      if (filters.category && (p.category?._id ?? p.category) !== filters.category) return false;
      if (filters.subCategory && (p.subCategory?._id ?? p.subCategory) !== filters.subCategory)
        return false;
      if (filters.brand && (p.brand?._id ?? p.brand) !== filters.brand) return false;
      if (filters.status === "active" && !p.isActive) return false;
      if (filters.status === "inactive" && p.isActive) return false;
      return true;
    });
  }, [products, filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(deleteProductData(deleteTarget._id)).unwrap();
      setDeleteTarget(null);
      showToast(`"${deleteTarget.name}" deleted`);
    } catch (err) {
      showToast(err || "Failed to delete product", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Products"
          description="Manage your product catalog and variants"
          actions={
            <Button onClick={() => navigate("/admin/products/new")}>
              <Plus size={16} />
              Add Product
            </Button>
          }
        />

        <ErrorAlert message={storeError} />

        <div className="glass-card relative overflow-hidden rounded-2xl p-4 shadow-float">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-1">
              <Input
                id="search"
                icon={<Search size={15} />}
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Search products…"
                containerClassName="h-full"
              />
            </div>
            <Select
              id="filter-category"
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value, subCategory: "" }))
              }
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              placeholder="All categories"
            />
            <Select
              id="filter-subcategory"
              value={filters.subCategory}
              onChange={(e) => setFilters((f) => ({ ...f, subCategory: e.target.value }))}
              options={filteredSubCategories.map((s) => ({ value: s._id, label: s.name }))}
              placeholder={filters.category ? "All sub-categories" : "Pick a category first"}
              disabled={!filters.category}
            />
            <Select
              id="filter-brand"
              value={filters.brand}
              onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
              options={brands.map((b) => ({ value: b._id, label: b.name }))}
              placeholder="All brands"
            />
            <Select
              id="filter-status"
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              placeholder="All statuses"
            />
          </div>
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between border-t border-white/60 pt-3">
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Package size={13} />
                {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
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
          onView={(p) => navigate(`/admin/products/${p._id}`)}
          onEdit={(p) => navigate(`/admin/products/${p._id}/edit`)}
          onManageVariants={(p) => navigate(`/admin/products/${p._id}`)}
          onDelete={setDeleteTarget}
        />

        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Delete product"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? Its variants and images will also be deleted. This cannot be undone.`}
        />
      </div>
    </PageTransition>
  );
}

export default Products;
