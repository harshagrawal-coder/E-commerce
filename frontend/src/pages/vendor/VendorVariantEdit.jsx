import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import FormPageHeader from "../../components/ui/FormPageHeader";
import VariantForm from "../../components/products/VariantForm";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { TableSkeleton } from "../../components/ui/Skeleton";
import {
  fetchVendorProductData,
} from "../../store/slices/vendorProduct.slice";
import {
  updateVendorVariantData,
  fetchVendorVariantsData,
} from "../../store/slices/vendorVariant.slice";
import { showToast } from "../../utils/toast";

function VendorVariantEdit() {
  const { id: productId, variantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: products, loading: productsLoading } = useSelector(
    (state) => state.vendorProduct,
  );
  const {
    data: variants,
    loading: variantsLoading,
  } = useSelector((state) => state.vendorVariant);

  const product = useMemo(
    () => products.find((p) => p._id === productId),
    [products, productId],
  );
  const variant = useMemo(
    () => variants.find((v) => v._id === variantId),
    [variants, variantId],
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!product && !productsLoading) dispatch(fetchVendorProductData());
    if (productId) dispatch(fetchVendorVariantsData(productId));
  }, [dispatch, productId, product, productsLoading]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError("");
    try {
      if (data.isDefault) {
        const others = variants.filter(
          (v) => v.isDefault && v._id !== variantId,
        );
        await Promise.all(
          others.map((v) =>
            dispatch(
              updateVendorVariantData({
                data: { isDefault: false },
                productId,
                id: v._id,
              }),
            ).catch(() => {}),
          ),
        );
      }
      await dispatch(
        updateVendorVariantData({ data, productId, id: variantId }),
      ).unwrap();
      showToast("Variant updated and submitted for approval");
      navigate(`/vendor/products/${productId}`);
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  if ((productsLoading || variantsLoading) && (!product || !variant)) {
    return <TableSkeleton columns={4} rows={6} />;
  }

  if (!product || !variant) {
    return (
      <PageTransition>
        <EmptyState
          icon={Package}
          title={!product ? "Product not found" : "Variant not found"}
          description="The resource you are looking for may have been deleted."
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
        <FormPageHeader
          title="Edit Variant"
          description={`Update variant ${variant.sku} for ${product.name}`}
          onBack={() => navigate(`/vendor/products/${productId}`)}
        />
        <VariantForm
          key={`${productId}-${variantId}`}
          mode="edit"
          product={product}
          initialValues={variant}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/vendor/products/${productId}`)}
          submitting={submitting}
          error={error}
        />
      </div>
    </PageTransition>
  );
}

export default VendorVariantEdit;