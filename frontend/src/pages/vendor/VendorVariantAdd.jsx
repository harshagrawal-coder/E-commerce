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
  createVendorVariant,
  updateVendorVariantData,
  fetchVendorVariantsData,
} from "../../store/slices/vendorVariant.slice";
import { showToast } from "../../utils/toast";

function VendorVariantAdd() {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: products, loading: productsLoading } = useSelector(
    (state) => state.vendorProduct,
  );
  const { data: variants } = useSelector((state) => state.vendorVariant);

  const product = useMemo(
    () => products.find((p) => p._id === productId),
    [products, productId],
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
        const others = variants.filter((v) => v.isDefault);
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
      await dispatch(createVendorVariant({ data, productId })).unwrap();
      showToast("Variant created and submitted for approval");
      navigate(`/vendor/products/${productId}`);
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  if (productsLoading && !product) return <TableSkeleton columns={4} rows={6} />;

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
        <FormPageHeader
          title="Add Variant"
          description={`Create a new variant for ${product.name}`}
          onBack={() => navigate(`/vendor/products/${productId}`)}
        />
        <VariantForm
          key={productId}
          mode="create"
          product={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/vendor/products/${productId}`)}
          submitting={submitting}
          error={error}
        />
      </div>
    </PageTransition>
  );
}

export default VendorVariantAdd;