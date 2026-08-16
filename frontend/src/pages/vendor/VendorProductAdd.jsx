import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/ui/PageTransition";
import FormPageHeader from "../../components/ui/FormPageHeader";
import ProductForm from "../../components/products/ProductForm";
import { createVendorProduct } from "../../store/slices/vendorProduct.slice";
import { showToast } from "../../utils/toast";

function VendorProductAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await dispatch(createVendorProduct(data)).unwrap();
      showToast("Product submitted for approval");
      navigate(`/vendor/products/${res.data.product._id}/edit`);
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <FormPageHeader
          title="Add Product"
          description="Create a new product for your store. It will be reviewed by an admin before going live."
          onBack={() => navigate("/vendor/products")}
        />
        <ProductForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => navigate("/vendor/products")}
          submitting={submitting}
          error={error}
        />
      </div>
    </PageTransition>
  );
}

export default VendorProductAdd;