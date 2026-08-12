import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/ui/PageTransition";
import FormPageHeader from "../../components/ui/FormPageHeader";
import ProductForm from "../../components/products/ProductForm";
import { createProduct } from "../../store/slices/product.slice";
import { showToast } from "../../utils/toast";

function ProductAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await dispatch(createProduct(data)).unwrap();
      showToast("Product created successfully");
      navigate(`/admin/products/${res.data.product._id}`);
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
          description="Create a new product for your catalog"
          onBack={() => navigate("/admin/products")}
        />
        <ProductForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/products")}
          submitting={submitting}
          error={error}
        />
      </div>
    </PageTransition>
  );
}

export default ProductAdd;
