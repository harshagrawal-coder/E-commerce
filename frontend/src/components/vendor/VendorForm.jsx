import { useState } from "react";
import {
  Building2,
  Store,
  FileText,
  Phone,
  MapPin,
  Images,
  XCircle,
} from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorAlert from "../ui/ErrorAlert";
import ImageUpload from "../ui/ImageUpload";

const emptyForm = {
  businessName: "",
  businessType: "",
  description: "",
  address: "",
  phone: "",
};

function mapInitial(vendor) {
  if (!vendor) return emptyForm;
  return {
    businessName: vendor.businessName || "",
    businessType: vendor.businessType || "",
    description: vendor.description || "",
    address: vendor.address || "",
    phone: vendor.phone || "",
  };
}

function VendorForm({
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
  submitting,
  error,
}) {
  const [form, setForm] = useState(() => mapInitial(initialValues));
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.businessName.trim())
      next.businessName = "Business name is required";
    else if (form.businessName.trim().length < 2)
      next.businessName = "Business name must be at least 2 characters";
    if (!form.businessType.trim())
      next.businessType = "Business type is required";
    else if (form.businessType.trim().length < 2)
      next.businessType = "Business type must be at least 2 characters";
    if (!form.description.trim()) next.description = "Description is required";
    else if (form.description.trim().length > 500)
      next.description = "Description must not exceed 500 characters";
    if (!form.address.trim()) next.address = "Address is required";
    else if (form.address.trim().length < 5)
      next.address = "Address must be at least 5 characters";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    else if (!/^[0-9+\-\s()]+$/.test(form.phone.trim()))
      next.phone = "Phone number contains invalid characters";
    if (mode === "create" && !image) next.image = "Business image is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, value.trim()),
    );
    if (image) data.append("image", image);

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {error && <ErrorAlert message={error} />}

        <Card
          title="Business Information"
          description="Details about your business and how customers can reach you"
          icon={Building2}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Input
                id="businessName"
                label="Business Name"
                value={form.businessName}
                onChange={(e) => setField("businessName", e.target.value)}
                placeholder="Acme Traders"
                error={errors.businessName}
                icon={<Building2 size={16} />}
                required
              />
              <Input
                id="businessType"
                label="Business Type"
                value={form.businessType}
                onChange={(e) => setField("businessType", e.target.value)}
                placeholder="Clothing, Electronics, Handicrafts…"
                error={errors.businessType}
                icon={<Store size={16} />}
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Tell customers about your business…"
                rows={4}
                aria-invalid={errors.description ? true : undefined}
                className={[
                  "w-full rounded-xl border bg-white/90 p-3 text-sm text-ink",
                  "placeholder:text-ink-muted/60",
                  "shadow-card transition-all duration-200 ease-out",
                  "focus:outline-none focus:ring-4 focus:ring-offset-0",
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/15",
                ].join(" ")}
                required
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.description ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.description}
                  </p>
                ) : (
                  <span className="text-xs text-ink-muted" />
                )}
                <span className="text-xs text-ink-muted">
                  {form.description.length}/500
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Input
                id="address"
                label="Business Address"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="123 Market Street, City"
                error={errors.address}
                icon={<MapPin size={16} />}
                required
              />
              <Input
                id="phone"
                label="Phone Number"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+1 234 567 890"
                error={errors.phone}
                icon={<Phone size={16} />}
                required
              />
            </div>
          </div>
        </Card>

        <Card
          title="Business Image"
          description="A logo or photo for your business"
          icon={Images}
        >
          <ImageUpload
            label="Profile Image"
            previewUrl={initialValues?.image?.url}
            onChange={(file) => {
              setImage(file);
              if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
            }}
          />
          {errors.image && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {errors.image}
            </p>
          )}
        </Card>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={submitting}>
            <XCircle size={16} />
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitting
            ? mode === "edit"
              ? "Saving changes…"
              : "Submitting application…"
            : mode === "edit"
              ? "Save Changes"
              : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}

export default VendorForm;
