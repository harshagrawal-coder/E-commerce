import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft, Check, X } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import ProductDetails from "../../components/products/ProductDetails";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/Skeleton";
import {
  fetchProductData,
  deleteProductData,
  updateProductStatusData,
} from "../../store/slices/product.slice";
import {
  fetchVariantsData,
  deleteVariantData,
  updateVariantStatusData,
  clearVariantError,
} from "../../store/slices/variant.slice";
import { showToast } from "../../utils/toast";

function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: products, loading: productsLoading } = useSelector(
    (state) => state.product,
  );
  const {
    data: variants,
    loading: variantsLoading,
    error: variantError,
  } = useSelector((state) => state.variant);

  const product = useMemo(
    () => products.find((p) => p._id === id),
    [products, id],
  );

  const [deleteProductTarget, setDeleteProductTarget] = useState(false);
  const [deleteVariantTarget, setDeleteVariantTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [variantStatusTarget, setVariantStatusTarget] = useState(null);
  const [updatingVariantStatus, setUpdatingVariantStatus] = useState(false);

  useEffect(() => {
    dispatch(fetchProductData());
  }, [dispatch]);

  useEffect(() => {
    if (id) dispatch(fetchVariantsData(id));
    return () => dispatch(clearVariantError());
  }, [dispatch, id]);

  const handleDeleteProduct = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteProductData(id)).unwrap();
      setDeleteProductTarget(false);
      showToast("Product deleted");
      navigate("/admin/products");
    } catch (err) {
      showToast(err || "Failed to delete product", "error");
      setDeleting(false);
    }
  };

  const handleDeleteVariant = async () => {
    if (!deleteVariantTarget) return;
    setDeleting(true);
    try {
      await dispatch(
        deleteVariantData({ productId: id, id: deleteVariantTarget._id }),
      ).unwrap();
      setDeleteVariantTarget(null);
      showToast(`Variant "${deleteVariantTarget.sku}" deleted`);
    } catch (err) {
      showToast(err || "Failed to delete variant", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!statusTarget) return;
    setUpdatingStatus(true);
    try {
      await dispatch(
        updateProductStatusData({ id, status: statusTarget }),
      ).unwrap();
      setStatusTarget(null);
      showToast(
        statusTarget === "approved" ? "Product approved" : "Product rejected",
      );
    } catch (err) {
      showToast(err || "Failed to update status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleVariantStatusChange = async () => {
    if (!variantStatusTarget) return;
    setUpdatingVariantStatus(true);
    try {
      await dispatch(
        updateVariantStatusData({
          id: variantStatusTarget._id,
          data: { status: variantStatusTarget.status },
        }),
      ).unwrap();
      setVariantStatusTarget(null);
      showToast(
        variantStatusTarget.status === "approved"
          ? `Variant "${variantStatusTarget.sku}" approved`
          : `Variant "${variantStatusTarget.sku}" rejected`,
      );
    } catch (err) {
      showToast(err || "Failed to update variant status", "error");
    } finally {
      setUpdatingVariantStatus(false);
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
            <Button onClick={() => navigate("/admin/products")}>
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
          onClick={() => navigate("/admin/products")}
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
          onEdit={() => navigate(`/admin/products/${id}/edit`)}
          onDelete={() => setDeleteProductTarget(true)}
          onAddVariant={() => navigate(`/admin/products/${id}/variants/new`)}
          onEditVariant={(variant) =>
            navigate(`/admin/products/${id}/variants/${variant._id}/edit`)
          }
          onDeleteVariant={setDeleteVariantTarget}
          onStatusChange={setStatusTarget}
          onApproveVariant={(variant) =>
            setVariantStatusTarget({ ...variant, status: "approved" })
          }
          onRejectVariant={(variant) =>
            setVariantStatusTarget({ ...variant, status: "rejected" })
          }
        />

        <ConfirmDialog
          open={!!variantStatusTarget}
          onClose={() => setVariantStatusTarget(null)}
          onConfirm={handleVariantStatusChange}
          loading={updatingVariantStatus}
          title={
            variantStatusTarget?.status === "approved"
              ? "Approve variant"
              : "Reject variant"
          }
          message={
            variantStatusTarget?.status === "approved"
              ? `Are you sure you want to approve variant "${variantStatusTarget?.sku}"? It will become visible on the storefront.`
              : `Are you sure you want to reject variant "${variantStatusTarget?.sku}"? It will be hidden until the vendor resubmits.`
          }
          confirmLabel={
            variantStatusTarget?.status === "approved" ? "Approve" : "Reject"
          }
          loadingLabel={
            variantStatusTarget?.status === "approved"
              ? "Approving..."
              : "Rejecting..."
          }
          confirmIcon={variantStatusTarget?.status === "approved" ? Check : X}
          confirmVariant={
            variantStatusTarget?.status === "approved" ? "primary" : "danger"
          }
        />

        <ConfirmDialog
          open={!!statusTarget}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleStatusChange}
          loading={updatingStatus}
          title={statusTarget === "approved" ? "Approve product" : "Reject product"}
          message={
            statusTarget === "approved"
              ? `Are you sure you want to approve "${product.name}"? It will become visible on the storefront.`
              : `Are you sure you want to reject "${product.name}"? The vendor can edit it and resubmit for approval.`
          }
          confirmLabel={statusTarget === "approved" ? "Approve" : "Reject"}
          loadingLabel={statusTarget === "approved" ? "Approving..." : "Rejecting..."}
          confirmIcon={statusTarget === "approved" ? Check : X}
          confirmVariant={statusTarget === "approved" ? "primary" : "danger"}
        />

        <ConfirmDialog
          open={deleteProductTarget}
          onClose={() => setDeleteProductTarget(false)}
          onConfirm={handleDeleteProduct}
          loading={deleting}
          title="Delete product"
          message={`Are you sure you want to delete "${product.name}"? Its variants and images will also be deleted. This cannot be undone.`}
        />

        <ConfirmDialog
          open={!!deleteVariantTarget}
          onClose={() => setDeleteVariantTarget(null)}
          onConfirm={handleDeleteVariant}
          loading={deleting}
          title="Delete variant"
          message={`Are you sure you want to delete variant "${deleteVariantTarget?.sku}"? This cannot be undone.`}
        />
      </div>
    </PageTransition>
  );
}

export default ProductDetailsPage;
