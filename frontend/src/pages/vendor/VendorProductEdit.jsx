import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import FormPageHeader from "../../components/ui/FormPageHeader";
import ProductForm from "../../components/products/ProductForm";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { TableSkeleton } from "../../components/ui/Skeleton";
import {
  fetchVendorProductData,
  updateVendorProductData,
} from "../../store/slices/vendorProduct.slice";
import { showToast } from "../../utils/toast";

function VendorProductEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: products, loading } = useSelector(
    (state) => state.vendorProduct,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const product = useMemo(
    () => products.find((p) => p._id === id),
    [products, id],
  );

  useEffect(() => {
    if (!product && !loading) {
      dispatch(fetchVendorProductData());
    }
  }, [dispatch, product, loading]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError("");
    try {
      await dispatch(updateVendorProductData({ data, id })).unwrap();
      showToast("Product updated and submitted for approval");
      navigate("/vendor/products");
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  if (loading && !product) return <TableSkeleton columns={4} rows={6} />;

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
          title="Edit Product"
          description={`Update ${product.name}`}
          onBack={() => navigate("/vendor/products")}
        />
        <ProductForm
          key={product._id}
          mode="edit"
          initialValues={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/vendor/products")}
          submitting={submitting}
          error={error}
        />
      </div>
    </PageTransition>
  );
}

export default VendorProductEdit;
