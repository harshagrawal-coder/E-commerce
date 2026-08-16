import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, Store, FilterX } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { fetchAllVendorsData } from "../../store/slices/adminVendor.slice";
import { formatDate } from "../../utils/format";

const statusTone = {
  pending: "amber",
  approved: "green",
  rejected: "red",
  suspended: "gray",
};

const emptyFilters = { search: "", status: "" };

function Vendors() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: vendors, loading, error } = useSelector(
    (state) => state.adminVendor,
  );

  const [filters, setFilters] = useState(emptyFilters);

  useEffect(() => {
    dispatch(fetchAllVendorsData());
  }, [dispatch]);

  const filteredVendors = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return vendors.filter((v) => {
      const user = v.user;
      const haystack = [
        v.businessName,
        v.businessType,
        user?.name,
        user?.email,
        v.phone,
        v.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filters.status && v.status !== filters.status) return false;
      return true;
    });
  }, [vendors, filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const columns = [
    {
      key: "business",
      header: "Business",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image?.url ? (
            <img
              src={row.image.url}
              alt={row.image.alt || row.businessName}
              className="h-10 w-10 shrink-0 rounded-xl border border-border bg-surface object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-ink-muted">
              <Store size={18} strokeWidth={1.5} />
            </div>
          )}
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => navigate(`/admin/vendors/${row._id}`)}
              className="block max-w-[16rem] truncate text-left text-sm font-medium text-ink transition-colors hover:text-primary"
            >
              {row.businessName}
            </button>
            <p className="text-xs text-ink-muted">{row.businessType}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => (
        <div>
          <p className="text-sm text-ink">{row.phone || "-"}</p>
          <p className="text-xs text-ink-muted">{row.user?.email || "-"}</p>
        </div>
      ),
    },
    {
      key: "address",
      header: "Address",
      render: (row) => (
        <span className="block max-w-[14rem] truncate text-sm text-ink-muted">
          {row.address}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={statusTone[row.status] || "gray"}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (row) => <span className="text-sm text-ink-muted">{formatDate(row.createdAt)}</span>,
    },
  ];

  if (loading && vendors.length === 0) return <TableSkeleton columns={6} rows={6} />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Vendors"
          description="Review vendor applications and manage their status"
        />

        <ErrorAlert message={error} />

        <div className="glass-card relative overflow-hidden rounded-2xl p-4 shadow-float">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <Input
                id="vendor-search"
                icon={<Search size={15} />}
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Search by business, type, contact or address…"
                containerClassName="h-full"
              />
            </div>
            <Select
              id="vendor-status"
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "suspended", label: "Suspended" },
              ]}
              placeholder="All statuses"
            />
          </div>
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between border-t border-white/60 pt-3">
              <p className="text-xs text-ink-muted">
                {filteredVendors.length} result
                {filteredVendors.length === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-50 hover:text-primary-700"
              >
                <FilterX size={13} />
                Clear filters
              </button>
            </div>
          )}
        </div>

        <DataTable
          columns={columns}
          rows={filteredVendors}
          loading={loading}
          onView={(row) => navigate(`/admin/vendors/${row._id}`)}
          emptyMessage="No vendors yet"
        />
      </div>
    </PageTransition>
  );
}

export default Vendors;