import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Info, Images, Settings2, XCircle, Sparkles } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Toggle from "../ui/Toggle";
import Button from "../ui/Button";
import ErrorAlert from "../ui/ErrorAlert";
import ProductImageUploader from "./ProductImageUploader";
import AttributeIcon from "./AttributeIcon";
import { colorHex } from "../../utils/colorValue";
import { fetchCategory } from "../../store/slices/categorySlice";
import { fetchSubCategoryData } from "../../store/slices/subCategorySlice";
import { fetchbrandData } from "../../store/slices/brand.slice";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  subCategory: "",
  brand: "",
  isActive: true,
  isFeatured: false,
};

function mapInitial(product) {
  if (!product) return emptyForm;
  return {
    name: product.name || "",
    description: product.description || "",
    category: product.category?._id ?? product.category ?? "",
    subCategory: product.subCategory?._id ?? product.subCategory ?? "",
    brand: product.brand?._id ?? product.brand ?? "",
    isActive: product.isActive ?? true,
    isFeatured: product.isFeatured ?? false,
  };
}

function mapImages(product) {
  if (!product?.images?.length) return [];
  return product.images.map((img, i) => ({
    key: img.url || `img-${i}`,
    url: img.url,
    alt: img.alt || "",
    fileId: img.fileId,
  }));
}

function ProductForm({ mode = "create", initialValues, onSubmit, onCancel, submitting, error }) {
  const dispatch = useDispatch();
  const { data: categories } = useSelector((state) => state.category);
  const { data: subCategories } = useSelector((state) => state.subCategory);
  const { data: brands } = useSelector((state) => state.brand);

  const [form, setForm] = useState(() => mapInitial(initialValues));
  const [images, setImages] = useState(() => mapImages(initialValues));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategory());
    dispatch(fetchSubCategoryData());
    dispatch(fetchbrandData());
  }, [dispatch]);

  const filteredSubCategories = useMemo(
    () => subCategories.filter((s) => (s.category?._id ?? s.category) === form.category),
    [subCategories, form.category],
  );

  const selectedSubCategory = useMemo(
    () => subCategories.find((s) => s._id === form.subCategory),
    [subCategories, form.subCategory],
  );

  const attributePreview = useMemo(
    () => selectedSubCategory?.allowedAttributes || [],
    [selectedSubCategory],
  );

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Product name is required";
    else if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.category) next.category = "Category is required";
    if (!form.subCategory) next.subCategory = "Sub category is required";
    if (!form.brand) next.brand = "Brand is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      subCategory: form.subCategory,
      brand: form.brand,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    const newFiles = images.filter((img) => img.file).map((img) => img.file);
    const existingImages = images
      .filter((img) => !img.file)
      .map((img) => ({ url: img.url, alt: img.alt, fileId: img.fileId }));

    let data = payload;
    if (newFiles.length) {
      data = new FormData();
      Object.entries(payload).forEach(([key, value]) => data.append(key, value));
      newFiles.forEach((file) => data.append("images", file));
      if (existingImages.length) {
        data.append("existingImages", JSON.stringify(existingImages));
      }
    } else {
      data = { ...payload, images: existingImages };
    }

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {error && <ErrorAlert message={error} />}

        <Card
          title="Basic Information"
          description="Name, category and brand details"
          icon={Info}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Input
                id="name"
                label="Product Name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="iPhone 17"
                error={errors.name}
                required
              />
              <Select
                id="brand"
                label="Brand"
                value={form.brand}
                onChange={(e) => setField("brand", e.target.value)}
                options={brands.map((b) => ({ value: b._id, label: b.name }))}
                placeholder="Select brand"
                error={errors.brand}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Select
                id="category"
                label="Category"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value, subCategory: "" }))
                }
                options={categories.map((c) => ({ value: c._id, label: c.name }))}
                placeholder="Select category"
                error={errors.category}
                required
              />
              <Select
                id="subCategory"
                label="Sub Category"
                value={form.subCategory}
                onChange={(e) => setField("subCategory", e.target.value)}
                options={filteredSubCategories.map((s) => ({ value: s._id, label: s.name }))}
                placeholder={form.category ? "Select sub category" : "Select a category first"}
                error={errors.subCategory}
                disabled={!form.category}
                required
              />
            </div>

            <Input
              id="description"
              label="Description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe the product in detail…"
              error={errors.description}
              required
            />

            {selectedSubCategory && attributePreview.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-b from-primary-50/70 to-white shadow-card"
              >
                <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-primary shadow-card">
                    <Sparkles size={14} />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {selectedSubCategory.name} attributes
                  </p>
                  <span className="ml-auto rounded-full border border-primary/15 bg-white px-2 py-0.5 text-[11px] font-medium text-primary shadow-card">
                    {attributePreview.length} configured
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                  {attributePreview.map((attr, i) => {
                    const name = attr.attribute?.name || "Attribute";
                    const values = attr.allowedValues || [];
                    return (
                      <div
                        key={attr.attribute?._id ?? i}
                        className="rounded-xl border border-border bg-white p-3 shadow-card"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700">
                            <AttributeIcon name={name} size={14} />
                          </span>
                          <span className="text-sm font-semibold text-ink">{name}</span>
                          {attr.required && (
                            <span className="rounded-full border border-red-100 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                              Required
                            </span>
                          )}
                          {attr.isVariant && (
                            <span className="rounded-full border border-primary/15 bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700">
                              Variant
                            </span>
                          )}
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {values.length ? (
                            values.map((v) => {
                              const hex = colorHex(v.value);
                              return (
                                <span
                                  key={v._id}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1 text-xs font-medium text-ink"
                                >
                                  {hex && (
                                    <span
                                      className="h-2 w-2 shrink-0 rounded-full border border-black/10"
                                      style={{ backgroundColor: hex }}
                                      aria-hidden="true"
                                    />
                                  )}
                                  {v.value}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-ink-muted">No values configured</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="px-4 pb-3 text-xs text-ink-muted">
                  These attributes are used when you create variants for this product.
                </p>
              </motion.div>
            )}
          </div>
        </Card>

        <Card
          title="Product Images"
          description="Upload, reorder and set a primary image"
          icon={Images}
        >
          <ProductImageUploader images={images} onChange={setImages} max={8} />
        </Card>

        <Card
          title="Product Settings"
          description="Control visibility and prominence in your store"
          icon={Settings2}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Toggle
              id="isActive"
              label="Active"
              description="Show this product in the storefront"
              checked={form.isActive}
              onChange={(v) => setField("isActive", v)}
            />
            <Toggle
              id="isFeatured"
              label="Featured"
              description="Highlight this product on the storefront"
              checked={form.isFeatured}
              onChange={(v) => setField("isFeatured", v)}
            />
          </div>
        </Card>
      </div>

      <motion.div
        initial={false}
        className="glass-strong sticky bottom-0 z-10 -mx-4 mt-8 border-t border-white/60 px-4 py-4 sm:-mx-6 sm:px-6"
      >
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={submitting}>
            <XCircle size={16} />
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {submitting ? "Saving product…" : mode === "edit" ? "Save Changes" : "Save Product"}
          </Button>
        </div>
      </motion.div>
    </form>
  );
}

export default ProductForm;
