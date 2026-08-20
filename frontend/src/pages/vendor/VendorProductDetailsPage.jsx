import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import ProductDetails from "../../components/products/ProductDetails";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/Skeleton";
import {
  fetchVendorProductData,
  deleteVendorProductData,
} from "../../store/slices/vendorProduct.slice";
import {
  fetchVendorVariantsData,
  deleteVendorVariantData,
  clearVendorVariantError,
} from "../../store/slices/vendorVariant.slice";
import { showToast } from "../../utils/toast";

function VendorProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: products, loading: productsLoading } = useSelector(
    (state) => state.vendorProduct,
  );
  const {
    data: variants,
    loading: variantsLoading,
    error: variantError,
  } = useSelector((state) => state.vendorVariant);

  const product = useMemo(
    () => products.find((p) => p._id === id),
    [products, id],
  );

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!product && !productsLoading) dispatch(fetchVendorProductData());
  }, [dispatch, product, productsLoading]);

  useEffect(() => {
    if (id) dispatch(fetchVendorVariantsData(id));
    return () => dispatch(clearVendorVariantError());
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(deleteVendorProductData(id)).unwrap();
      setDeleteTarget(null);
      showToast(`"${product.name}" deleted`);
      navigate("/vendor/products");
    } catch (err) {
      showToast(err || "Failed to delete product", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteVariant = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(
        deleteVendorVariantData({
          productId: id,
          id: deleteTarget._id,
        }),
      ).unwrap();
      setDeleteTarget(null);
      showToast(`Variant "${deleteTarget.sku}" deleted`);
    } catch (err) {
      showToast(err || "Failed to delete variant", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (productsLoading && !product)
    return <TableSkeleton columns={4} rows={6} />;

  if (!product) {
    return (
      <PageTransition>
        <EmptyState
          icon={Package}
          title="Product not found"
          description="This product may have been deleted or the link is invalid."
          action={
            <Button onClick={() => navigate("/vendor/products")}>
              <ArrowLeft size={16} />
              Back to products
            </Button>
          }
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/vendor/products")}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to products
        </button>

        {variantError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Could not load variants: {variantError}
          </div>
        )}

        <ProductDetails
          product={product}
          variants={variants}
          variantsLoading={variantsLoading}
          onEdit={() => navigate(`/vendor/products/${id}/edit`)}
          onDelete={() => setDeleteTarget(product)}
          onAddVariant={() => navigate(`/vendor/products/${id}/variants/new`)}
          onEditVariant={(variant) =>
            navigate(`/vendor/products/${id}/variants/${variant._id}/edit`)
          }
          onDeleteVariant={setDeleteTarget}
        />

        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={deleteTarget?.sku ? handleDeleteVariant : handleDelete}
          loading={deleting}
          title={deleteTarget?.sku ? "Delete variant" : "Delete product"}
          message={
            deleteTarget?.sku
              ? `Are you sure you want to delete variant "${deleteTarget.sku}"? This cannot be undone.`
              : `Are you sure you want to delete "${deleteTarget?.name}"? Its variants and images will also be deleted. This cannot be undone.`
          }
        />
      </div>
    </PageTransition>
  );
}

export default VendorProductDetailsPage;
