import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";
import Badge from "../../components/ui/Badge";
import ImageUpload from "../../components/ui/ImageUpload";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { useSelector, useDispatch } from "react-redux";
import {
  createCategory,
  fetchCategory,
  updateCategorydata,
  deleteCategorydata,
} from "../../store/slices/categorySlice";
const emptyForm = { name: "", description: "", isActive: true };

function Categories() {
  const dispatch = useDispatch();
  const { loading, error, data: rows } = useSelector((state) => state.category);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || "",
      description: row.description || "",
      isActive: row.isActive ?? true,
    });
    setImage(null);
    setModalOpen(true);
  };
  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("isActive", form.isActive);

      if (image) {
        formData.append("image", image);
      }

      if (editing) {
        await dispatch(
          updateCategorydata({
            data: formData,
            id: editing._id,
          }),
        ).unwrap();
      } else {
        await dispatch(createCategory(formData)).unwrap();
      }

      setModalOpen(false);
      setForm(emptyForm);
      setImage(null);
      setEditing(null);
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
      await dispatch(deleteCategorydata(deleteTarget._id)).unwrap();
      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (row) =>
        row.image?.url ? (
          <img
            src={row.image.url}
            alt={row.name}
            className="h-10 w-10 rounded-lg border border-border object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-xs text-ink-muted">
            -
          </span>
        ),
    },
    {
      key: "name",
      header: "Name",
      render: (row) => <span className="font-medium text-ink">{row.name}</span>,
    },
    { key: "slug", header: "Slug" },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span className="line-clamp-1 text-ink-muted">
          {row.description || "-"}
        </span>
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
        title="Categories"
        description="Manage product categories"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Category
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
        emptyMessage="No categories yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" form="category-form" loading={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Electronics"
            required
          />
          <Input
            id="description"
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Category description (optional)"
          />
          <ImageUpload
            label="Image"
            value={image}
            onChange={setImage}
            previewUrl={editing?.image?.url}
          />
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
        title="Delete category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default Categories;
