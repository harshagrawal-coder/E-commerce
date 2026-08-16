import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  ShoppingCart,
  DollarSign,
  Building2,
  Briefcase,
  FileText,
  BadgeCheck,
  Pencil,
  X,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import VendorForm from "../../components/vendor/VendorForm";
import {
  fetchVendorData,
  createVendorProfile,
  updateVendorProfile,
} from "../../store/slices/vendor.slice";
import { showToast } from "../../utils/toast";

function statusConfig(status) {
  const map = {
    pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
    approved: { label: "Approved", className: "bg-green-100 text-green-800" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
    suspended: { label: "Suspended", className: "bg-gray-200 text-gray-700" },
  };
  return map[status] || { label: status || "N/A", className: "bg-gray-100 text-gray-700" };
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              Icon === Package
                ? "bg-blue-50 text-blue-600"
                : Icon === ShoppingCart
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
            }`}
          >
            <Icon size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink">{value}</p>
            <p className="text-sm text-ink-muted">{label}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value, className = "" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className={`truncate text-sm font-medium text-ink ${className}`}>{value}</p>
      </div>
    </div>
  );
}

function ProfileView({ vendor, onEdit }) {
  const { user } = useSelector((state) => state.auth);
  const vUser = vendor?.user || user;
  const status = statusConfig(vendor?.status);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile / Business Card */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                {vendor?.image?.url ? (
                  <img
                    src={vendor.image.url}
                    alt={vendor.image.alt || vendor.businessName}
                    className="h-20 w-20 rounded-2xl border border-border object-cover shadow-card"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-3xl font-bold text-white shadow-primary">
                    {(vendor?.businessName || vUser?.name || "V").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-ink">
                      {vendor?.businessName || vUser?.name || "Vendor"}
                    </h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                    <span className="flex items-center gap-1 capitalize">
                      <Store size={14} /> {vendor?.businessType || vUser?.role || "Vendor"}
                    </span>
                    {vUser?.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {vUser.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={onEdit}>
                <Pencil size={14} />
                Edit Profile
              </Button>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h3 className="mb-4 text-lg font-semibold text-ink">Business Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Building2} label="Business Name" value={vendor.businessName} />
                <InfoRow
                  icon={Briefcase}
                  label="Business Type"
                  value={vendor.businessType}
                  className="capitalize"
                />
                <InfoRow icon={Phone} label="Phone" value={vendor.phone} />
                <InfoRow icon={MapPin} label="Address" value={vendor.address} />
              </div>
            </div>

            {vendor?.description && (
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-ink">
                  <FileText size={16} className="text-ink-muted" /> About
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">{vendor.description}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <StatCard icon={Package} value="0" label="Total Products" />
          <StatCard icon={ShoppingCart} value="0" label="Total Orders" />
          <StatCard icon={DollarSign} value="$0" label="Total Revenue" />
        </div>
      </div>

      {/* Account details */}
      <Card
        title="Account Details"
        description="Information tied to your login account"
        icon={BadgeCheck}
        bodyClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div className="flex items-center gap-3 rounded-xl bg-surface p-4">
          <div>
            <p className="text-xs text-ink-muted">Name</p>
            <p className="truncate text-sm font-medium text-ink">{vUser?.name || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-surface p-4">
          <div>
            <p className="text-xs text-ink-muted">Email</p>
            <p className="truncate text-sm font-medium text-ink">{vUser?.email || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-surface p-4">
          <div>
            <p className="text-xs text-ink-muted">Role</p>
            <p className="capitalize text-sm font-medium text-ink">{vUser?.role || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-surface p-4">
          <Calendar size={20} className="shrink-0 text-ink-muted" />
          <div>
            <p className="text-xs text-ink-muted">Vendor Joined</p>
            <p className="text-sm font-medium text-ink">
              {vendor?.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-surface p-4">
          <BadgeCheck size={20} className="shrink-0 text-ink-muted" />
          <div>
            <p className="text-xs text-ink-muted">Status</p>
            <p className="text-sm font-medium text-ink">
              {vendor?.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}

function VendorDashboard() {
  const dispatch = useDispatch();
  const { updating, error } = useSelector((state) => state.vendor);
  const { data: vendor, loading, isFetched } = useSelector((state) => state.vendor);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!isFetched) dispatch(fetchVendorData());
  }, [dispatch, isFetched]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createVendorProfile(data)).unwrap();
      showToast("Vendor application submitted successfully");
      setEditing(false);
      dispatch(fetchVendorData());
    } catch (err) {
      showToast(err, "error");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateVendorProfile({ data, id: vendor._id })).unwrap();
      showToast("Vendor profile updated successfully");
      setEditing(false);
    } catch (err) {
      showToast(err, "error");
    }
  };

  const showCreateForm = !loading && !vendor;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Dashboard"
        description={
          vendor
            ? "Your business profile and store overview"
            : "Complete your business profile to start selling"
        }
      />

      {loading && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="animate-pulse p-6" />
          <Card className="animate-pulse p-6" />
          <Card className="animate-pulse p-6" />
        </div>
      )}

      {showCreateForm && (
        <Card
          title="Create Your Business Profile"
          description="Fill in the details below to apply as a seller"
          icon={Store}
        >
          <VendorForm
            mode="create"
            onSubmit={handleCreate}
            submitting={updating}
            error={error}
          />
        </Card>
      )}

      {vendor && editing && (
        <Card
          title="Edit Business Profile"
          description="Update your business details"
          icon={Pencil}
          action={
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              <X size={14} />
              Cancel
            </Button>
          }
        >
          <VendorForm
            mode="edit"
            initialValues={vendor}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            submitting={updating}
            error={error}
          />
        </Card>
      )}

      {vendor && !editing && <ProfileView vendor={vendor} onEdit={() => setEditing(true)} />}
    </div>
  );
}

export default VendorDashboard;