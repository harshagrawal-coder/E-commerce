import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Settings2,
  Images,
  Tags,
  XCircle,
  Wand2,
  PackageOpen,
  ChevronRight,
} from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Toggle from "../ui/Toggle";
import ErrorAlert from "../ui/ErrorAlert";
import ProductImageUploader from "./ProductImageUploader";
import DynamicAttributeField from "./DynamicAttributeField";
import PriceCard from "./PriceCard";
import InventoryCard from "./InventoryCard";
import StatusBadge from "../ui/StatusBadge";
import { fetchSubCategoryData } from "../../store/slices/subCategorySlice";
import { getName } from "../../utils/format";
import { colorHex } from "../../utils/colorValue";

function mapAttributes(variant) {
  if (!variant?.attributes?.length) return [];
  return variant.attributes.map((a) => ({
    attribute: a.attribute?._id ?? a.attribute,
    value: a.value?._id ?? a.value,
  }));
}

function mapImages(variant) {
  if (!variant?.images?.length) return [];
  return variant.images.map((img, i) => ({
    key: img.url || `img-${i}`,
    url: img.url,
    alt: img.alt || "",
    fileId: img.fileId,
  }));
}

function ProductSummary({ product }) {
  const image = product.images?.[0]?.url;
  const status = product.isActive ? "active" : "inactive";
  return (
    <div className="glass-card relative flex items-center gap-4 overflow-hidden rounded-2xl p-4 shadow-card">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent"
        aria-hidden="true"
      />
      {image ? (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/70 shadow-raised">
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-primary-100 text-primary">
          <PackageOpen size={22} strokeWidth={1.5} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{product.name}</p>
        <p className="mt-1 inline-flex flex-wrap items-center gap-1 text-xs text-ink-muted">
          <span className="font-medium text-ink">
            {getName(product.category)}
          </span>
          <ChevronRight size={12} />
          <span>{getName(product.subCategory)}</span>
        </p>
      </div>
      <StatusBadge status={status}>
        {product.isActive ? "Active" : "Inactive"}
      </StatusBadge>
    </div>
  );
}

function VariantForm({
  mode = "create",
  product,
  initialValues,
  onSubmit,
  onCancel,
  submitting,
  error,
}) {
  const dispatch = useDispatch();
  const { data: subCategories } = useSelector((state) => state.subCategory);

  const [sku, setSku] = useState(initialValues?.sku || "");
  const [attributes, setAttributes] = useState(() =>
    mapAttributes(initialValues),
  );
  const [mrp, setMrp] = useState(
    initialValues?.mrp ?? initialValues?.price ?? "",
  );
  const [sellingPrice, setSellingPrice] = useState(initialValues?.price ?? "");
  const [costPrice, setCostPrice] = useState(initialValues?.costPrice ?? "");
  const [stock, setStock] = useState(initialValues?.stock ?? 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(
    initialValues?.lowStockThreshold ?? 5,
  );
  const [images, setImages] = useState(() => mapImages(initialValues));
  const [isDefault, setIsDefault] = useState(initialValues?.isDefault ?? false);
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSubCategoryData());
  }, [dispatch]);

  const subCategoryConfig = useMemo(() => {
    const subId = product.subCategory?._id ?? product.subCategory;
    return subCategories.find((s) => s._id === subId) || null;
  }, [subCategories, product.subCategory]);

  const allowedAttributes = useMemo(() => {
    const list = subCategoryConfig?.allowedAttributes || [];
    return list
      .filter((c) => c.allowedValues?.length)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [subCategoryConfig]);

  const valueFor = (attributeId) =>
    attributes.find((a) => a.attribute === attributeId)?.value || "";

  const handleAttributeChange = (attributeId, value) => {
    setAttributes((prev) => {
      const exists = prev.find((a) => a.attribute === attributeId);
      if (exists) {
        return prev.map((a) =>
          a.attribute === attributeId ? { ...a, value } : a,
        );
      }
      return [...prev, { attribute: attributeId, value }];
    });
  };

  const selectedValueLabels = useMemo(() => {
    return attributes
      .map((a) => {
        const config = allowedAttributes.find(
          (c) => c.attribute?._id === a.attribute,
        );
        const val = config?.allowedValues?.find((v) => v._id === a.value);
        return { config, val };
      })
      .filter((x) => x.val);
  }, [attributes, allowedAttributes]);

  const autoGenerateSku = () => {
    const prefix = product.name
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase();
    const parts = selectedValueLabels.map(({ val }) =>
      val.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
    );
    const generated = [prefix, ...parts].filter(Boolean).join("-");
    if (generated) {
      setSku(generated);
      setErrors((prev) => ({ ...prev, sku: "" }));
    }
  };

  const validate = () => {
    const next = {};
    if (!sku.trim()) next.sku = "SKU is required";
    for (const config of allowedAttributes) {
      const selected = valueFor(config.attribute?._id);
      if ((config.required || config.isVariant) && !selected) {
        next[config.attribute?._id] = `${config.attribute?.name} is required`;
      }
    }
    if (sellingPrice === "" || Number(sellingPrice) < 0) {
      next.sellingPrice = "Selling price is required";
    }
    const m = Number(mrp || 0);
    const s = Number(sellingPrice || 0);
    if (m > 0 && s > m) {
      next.sellingPrice = "Selling price cannot exceed MRP";
    }
    if (Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      next.stock = "Stock must be a non-negative whole number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const attributePayload = attributes
      .filter((a) => a.value)
      .map((a) => ({ attribute: a.attribute, value: a.value }));

    const payload = {
      sku: sku.trim(),
      price: Number(sellingPrice),
      stock: Number(stock),
      attributes: attributePayload,
      isDefault,
      isActive,
      mrp: Number(mrp || 0),
      costPrice: Number(costPrice || 0),
      lowStockThreshold: Number(lowStockThreshold || 0),
    };

    const newFiles = images.filter((img) => img.file).map((img) => img.file);
    const existingImages = images
      .filter((img) => !img.file)
      .map((img) => ({ url: img.url, alt: img.alt, fileId: img.fileId }));

    let data = payload;
    if (newFiles.length) {
      data = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        data.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value,
        );
      });
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

        <ProductSummary product={product} />

        {subCategoryConfig && allowedAttributes.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-700">
            This sub-category has no attributes configured. Variants can still
            be created with a SKU and pricing only.
          </div>
        )}

        {allowedAttributes.length > 0 && (
          <Card
            title="Variant Attributes"
            description={`Attributes configured for ${getName(product.subCategory)}`}
            icon={Tags}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {allowedAttributes.map((config) => (
                <DynamicAttributeField
                  key={config.attribute?._id}
                  config={config}
                  value={valueFor(config.attribute?._id)}
                  onChange={(value) =>
                    handleAttributeChange(config.attribute?._id, value)
                  }
                  error={errors[config.attribute?._id]}
                  required={config.required || config.isVariant}
                />
              ))}
            </div>
            {selectedValueLabels.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Selected
                </span>
                {selectedValueLabels.map(({ config, val }) => {
                  const hex = colorHex(val.value);
                  return (
                    <span
                      key={config.attribute?._id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary-50 px-2 py-1 text-xs font-medium text-primary"
                    >
                      {hex && (
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: hex }}
                          aria-hidden="true"
                        />
                      )}
                      {val.value}
                    </span>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        <Card
          title="SKU"
          description="A unique identifier for this variant"
          icon={PackageOpen}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                id="sku"
                label="SKU"
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                  if (errors.sku) setErrors((prev) => ({ ...prev, sku: "" }));
                }}
                placeholder="IP17-B-256"
                error={errors.sku}
                hint="Auto-suggested from the selected attributes"
                className="font-mono"
                required
              />
            </div>
            <Button
              variant="secondary"
              onClick={autoGenerateSku}
              type="button"
              className="mb-0.5"
              disabled={selectedValueLabels.length === 0}
            >
              <Wand2 size={16} />
              Generate SKU
            </Button>
          </div>
        </Card>

        <Card
          title="Variant Images"
          description="Upload images specific to this variant"
          icon={Images}
        >
          <ProductImageUploader images={images} onChange={setImages} max={6} />
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PriceCard
            mrp={mrp}
            sellingPrice={sellingPrice}
            costPrice={costPrice}
            onChange={(field, value) => {
              if (field === "mrp") {
                setMrp(value);
                if (errors.sellingPrice)
                  setErrors((prev) => ({ ...prev, sellingPrice: "" }));
              } else if (field === "sellingPrice") {
                setSellingPrice(value);
                if (errors.sellingPrice)
                  setErrors((prev) => ({ ...prev, sellingPrice: "" }));
              } else {
                setCostPrice(value);
              }
            }}
            errors={errors}
          />
          <InventoryCard
            stock={stock}
            lowStockThreshold={lowStockThreshold}
            onChange={(field, value) => {
              if (field === "stock") {
                setStock(value);
                if (errors.stock) setErrors((prev) => ({ ...prev, stock: "" }));
              } else {
                setLowStockThreshold(value);
              }
            }}
            errors={errors}
          />
        </div>

        <Card
          title="Variant Settings"
          description="Default and visibility controls"
          icon={Settings2}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Toggle
              id="isDefault"
              label="Default Variant"
              description="Selected by default when customers open the product"
              checked={isDefault}
              onChange={setIsDefault}
            />
            <Toggle
              id="isActive"
              label="Active"
              description="Allow customers to purchase this variant"
              checked={isActive}
              onChange={setIsActive}
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
            {submitting
              ? "Saving variant…"
              : mode === "edit"
                ? "Save Changes"
                : "Save Variant"}
          </Button>
        </div>
      </motion.div>
    </form>
  );
}

export default VariantForm;
