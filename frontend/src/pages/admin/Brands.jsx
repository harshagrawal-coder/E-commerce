import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorAlert from "../../components/ui/ErrorAlert";
import {
  fetchbrandData,
  createBrand,
  updateBranddata,
  deleteBranddata,
} from "../../store/slices/brand.slice";
import { fetchSubCategoryData } from "../../store/slices/subCategorySlice";
import { useDispatch, useSelector } from "react-redux";
const emptyForm = { name: "", subCategories: [], isActive: true };

function Brands() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const { data: subCategories } = useSelector((state) => state.subCategory);
  const { data: rows, loading, error } = useSelector((state) => state.brand);
  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || "",
      subCategories: (row.subCategories || []).map((s) => s._id ?? s),
      isActive: row.isActive ?? true,
    });
    setModalOpen(true);
  };

  const toggleSubCategory = (id) => {
    setForm((p) => {
      const exists = p.subCategories.includes(id);
      return {
        ...p,
        subCategories: exists
          ? p.subCategories.filter((s) => s !== id)
          : [...p.subCategories, id],
      };
    });
  };
  useEffect(() => {
    dispatch(fetchbrandData());
    dispatch(fetchSubCategoryData());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      name: form.name,
      subCategories: form.subCategories,
      isActive: form.isActive,
    };

    try {
      if (editing) {
        await dispatch(
          updateBranddata({ data, id: editing._id }),
        ).unwrap();
      } else {
        await dispatch(createBrand(data)).unwrap();
      }

      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await dispatch(deleteBranddata(deleteTarget._id)).unwrap();
      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const subCategoryMap = useMemo(
    () =>
      subCategories.reduce(
        (acc, sub) => ({ ...acc, [sub._id]: sub }),
        {},
      ),
    [subCategories],
  );

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row) => <span className="font-medium text-ink">{row.name}</span>,
    },
    { key: "slug", header: "Slug" },
    {
      key: "subCategories",
      header: "Sub Categories",
      render: (row) => (
        <div className="flex max-w-xs flex-wrap gap-1">
          {(row.subCategories || []).length === 0 && (
            <span className="text-ink-muted">-</span>
          )}
          {(row.subCategories || []).slice(0, 3).map((s) => {
            const sub = typeof s === "object" ? s : subCategoryMap[s];
            return (
              <Badge key={sub?._id ?? s} tone="blue">
                {sub?.name ?? s}
              </Badge>
            );
          })}
          {(row.subCategories || []).length > 3 && (
            <Badge>+{(row.subCategories || []).length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (row) =>
        row.isActive ? (
          <Badge tone="green">Active</Badge>
        ) : (
          <Badge tone="red">Inactive</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage product brands"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Brand
          </Button>
        }
      />

      <ErrorAlert message={error} />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No brands yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Brand" : "Add Brand"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" form="brand-form" loading={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <form id="brand-form" onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Apple"
            required
          />

          <div>
            <span className="mb-2 block text-sm font-medium text-ink">
              Sub Categories
            </span>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-border bg-surface p-3">
              {subCategories.length === 0 && (
                <p className="text-sm text-ink-muted">
                  No sub categories available
                </p>
              )}
              {subCategories.map((sub) => (
                <label
                  key={sub._id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-white"
                >
                  <input
                    type="checkbox"
                    checked={form.subCategories.includes(sub._id)}
                    onChange={() => toggleSubCategory(sub._id)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-ink">{sub.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Checkbox
            id="isActive"
            checked={form.isActive}
            onChange={(e) =>
              setForm((p) => ({ ...p, isActive: e.target.checked }))
            }
            label="Active"
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete brand"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default Brands;
