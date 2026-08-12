import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Checkbox from "../../components/ui/Checkbox";
import Badge from "../../components/ui/Badge";
import ImageUpload from "../../components/ui/ImageUpload";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorAlert from "../../components/ui/ErrorAlert";
import SubCategoryAttributeBuilder from "../../components/subcategories/SubCategoryAttributeBuilder";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSubCategoryData,
  createSubCategory,
  updateSubCategorydata,
  deleteSubCategorydata,
} from "../../store/slices/subCategorySlice";
import { fetchCategory } from "../../store/slices/categorySlice";
import { fetchAttributeData } from "../../store/slices/attibute.slice";

const emptyForm = { name: "", description: "", category: "", isActive: true };

function mapAllowedAttributes(list = []) {
  return list.map((a) => ({
    attribute: a.attribute?._id ?? a.attribute ?? "",
    allowedValues: (a.allowedValues || []).map((v) => v._id ?? v),
    required: a.required || false,
    isVariant: a.isVariant || false,
    isFilterable: a.isFilterable ?? true,
    isVisible: a.isVisible ?? true,
    displayOrder: a.displayOrder ?? 0,
  }));
}

function SubCategories() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [allowedAttributes, setAllowedAttributes] = useState([]);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const {
    data: rows,
    loading,
    error,
  } = useSelector((state) => state.subCategory);

  const { data: categories } = useSelector((state) => state.category);
  const { data: attributes } = useSelector((state) => state.attribute);

  useEffect(() => {
    dispatch(fetchSubCategoryData());

    if (categories.length === 0) {
      dispatch(fetchCategory());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (attributes.length === 0) dispatch(fetchAttributeData());
  }, [dispatch, attributes.length]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setAllowedAttributes([]);
    setImage(null);
    setModalOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || "",
      description: row.description || "",
      category: row.category?._id ?? row.category ?? "",
      isActive: row.isActive ?? true,
    });
    setAllowedAttributes(mapAllowedAttributes(row.allowedAttributes));
    setImage(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) {
      return;
    }
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("isActive", form.isActive);
      formData.append(
        "allowedAttributes",
        JSON.stringify(allowedAttributes.filter((r) => r.attribute)),
      );

      if (image) {
        formData.append("image", image);
      }

      if (editing) {
        await dispatch(
          updateSubCategorydata({
            data: formData,
            id: editing._id,
          }),
        ).unwrap();
      } else {
        await dispatch(createSubCategory(formData)).unwrap();
      }

      dispatch(fetchSubCategoryData());
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setAllowedAttributes([]);
      setImage(null);
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
      await dispatch(deleteSubCategorydata(deleteTarget._id)).unwrap();

      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

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
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="text-ink-muted">
          {row.category?.name ?? row.category ?? "-"}
        </span>
      ),
    },
    {
      key: "attributes",
      header: "Attributes",
      render: (row) => {
        const list = row.allowedAttributes || [];
        return list.length ? (
          <div className="flex flex-wrap gap-1.5">
            {list.map((a) => {
              const name = a.attribute?.name ?? a.attribute ?? "?";
              return (
                <Badge key={name} tone="blue">
                  {name}
                </Badge>
              );
            })}
          </div>
        ) : (
          <span className="text-xs text-ink-muted/60">—</span>
        );
      },
    },
    { key: "slug", header: "Slug" },
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
        title="Sub Categories"
        description="Manage sub categories and connect their attributes"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Sub Category
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
        emptyMessage="No sub categories yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Sub Category" : "Add Sub Category"}
        size="xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" form="subcategory-form" loading={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <form
          id="subcategory-form"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Mobile Phones"
            required
          />
          <Select
            id="category"
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
            options={categoryOptions}
            placeholder="Select a category"
            required
          />
          <Input
            id="description"
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Description (optional)"
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

          {/* Attribute connection */}
          <SubCategoryAttributeBuilder
            rows={allowedAttributes}
            onChange={setAllowedAttributes}
            attributes={attributes}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete sub category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default SubCategories;
