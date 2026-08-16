import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Store,
  Mail,
  Phone,
  MapPin,
  Building2,
  BadgeCheck,
  CalendarDays,
  ShieldAlert,
  XCircle,
  User,
} from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { TableSkeleton } from "../../components/ui/Skeleton";
import {
  fetchVendorDetailData,
  updateVendorStatusData,
  clearError,
} from "../../store/slices/adminVendor.slice";
import { showToast } from "../../utils/toast";
import { formatDate } from "../../utils/format";

const statusTone = {
  pending: "amber",
  approved: "green",
  rejected: "red",
  suspended: "gray",
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-ink-muted">
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm text-ink">{value || "-"}</p>
      </div>
    </div>
  );
}

function VendorDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { detail: vendor, detailLoading, detailError, updating, error } =
    useSelector((state) => state.adminVendor);

  const [statusTarget, setStatusTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchVendorDetailData(id));
    return () => dispatch(clearError());
  }, [dispatch, id]);

  const handleStatusChange = async () => {
    if (!statusTarget) return;
    try {
      await dispatch(
        updateVendorStatusData({ data: { status: statusTarget }, id }),
      ).unwrap();
      setStatusTarget(null);
      showToast(
        `Vendor ${statusTarget.charAt(0).toUpperCase() + statusTarget.slice(1)}`,
      );
      dispatch(fetchVendorDetailData(id));
    } catch (err) {
      showToast(err || "Failed to update vendor status", "error");
    }
  };

  if (detailLoading && !vendor) return <TableSkeleton columns={4} rows={6} />;

  if (!vendor) {
    return (
      <PageTransition>
        <EmptyState
          icon={Store}
          title="Vendor not found"
          description="This vendor may have been removed or the link is invalid."
          action={
            <Button onClick={() => navigate("/admin/vendors")}>
              <ArrowLeft size={16} />
              Back to vendors
            </Button>
          }
        />
      </PageTransition>
    );
  }

  const status = vendor.status;
  const statusActions = [];
  if (status !== "approved") {
    statusActions.push({ key: "approved", label: "Approve", icon: BadgeCheck, variant: "primary" });
  }
  if (status !== "rejected") {
    statusActions.push({ key: "rejected", label: "Reject", icon: XCircle, variant: "danger" });
  }
  if (status !== "suspended") {
    statusActions.push({ key: "suspended", label: "Suspend", icon: ShieldAlert, variant: "secondary" });
  }

  const statusMessages = {
    approved: "Approve this vendor? They will be able to sell products immediately.",
    rejected: "Reject this vendor application? The vendor will no longer be able to sell.",
    suspended: "Suspend this vendor? Their store will be taken offline until re-approved.",
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/vendors")}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to vendors
        </button>

        <ErrorAlert message={error || detailError} />

        {/* Header */}
        <Card>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {vendor.image?.url ? (
                <img
                  src={vendor.image.url}
                  alt={vendor.image.alt || vendor.businessName}
                  className="h-16 w-16 rounded-2xl border border-border bg-surface object-cover shadow-card"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 shadow-card">
                  <Store size={28} strokeWidth={1.5} />
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-ink">
                    {vendor.businessName}
                  </h1>
                  <Badge tone={statusTone[status] || "gray"}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  {!vendor.isActive && <Badge tone="gray">Inactive</Badge>}
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {vendor.businessType} • Joined {formatDate(vendor.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {statusActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.key}
                    variant={action.variant}
                    size="sm"
                    onClick={() => setStatusTarget(action.key)}
                    loading={updating && statusTarget === action.key}
                    disabled={updating}
                  >
                    <Icon size={15} />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Contact & business info */}
          <Card
            title="Business Information"
            description="Vendor account and contact details"
            icon={Building2}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailRow icon={Store} label="Business Name" value={vendor.businessName} />
              <DetailRow icon={Building2} label="Business Type" value={vendor.businessType} />
              <DetailRow icon={User} label="Owner Name" value={vendor.user?.name} />
              <DetailRow icon={Mail} label="Email" value={vendor.user?.email} />
              <DetailRow icon={Phone} label="Phone" value={vendor.phone} />
              <DetailRow icon={MapPin} label="Address" value={vendor.address} />
            </div>
          </Card>

          {/* Meta */}
          <Card title="Details" description="Status and activity" icon={BadgeCheck}>
            <div className="space-y-5">
              <DetailRow
                icon={BadgeCheck}
                label="Account Status"
                value={
                  status.charAt(0).toUpperCase() + status.slice(1)
                }
              />
              <DetailRow
                icon={CalendarDays}
                label="Registered On"
                value={formatDate(vendor.createdAt)}
              />
              <DetailRow
                icon={CalendarDays}
                label="Last Updated"
                value={formatDate(vendor.updatedAt)}
              />
            </div>
          </Card>

          {/* Description */}
          <Card
            title="About the business"
            description="Vendor provided description"
            icon={Store}
            className="lg:col-span-3"
          >
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
              {vendor.description || "-"}
            </p>
          </Card>
        </div>

        <Modal
          open={!!statusTarget}
          onClose={() => setStatusTarget(null)}
          title={`${statusTarget?.charAt(0).toUpperCase()}${statusTarget?.slice(1)} vendor`}
          size="sm"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setStatusTarget(null)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                variant={statusTarget === "rejected" ? "danger" : "primary"}
                onClick={handleStatusChange}
                loading={updating}
                disabled={updating}
              >
                {updating ? "Updating..." : "Confirm"}
              </Button>
            </>
          }
        >
          <p className="text-sm text-ink-muted">
            {statusTarget
              ? statusMessages[statusTarget]
              : "Are you sure you want to change this vendor's status?"}
          </p>
        </Modal>
      </div>
    </PageTransition>
  );
}

export default VendorDetails;