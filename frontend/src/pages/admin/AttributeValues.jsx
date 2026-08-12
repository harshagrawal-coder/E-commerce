import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Checkbox from "../../components/ui/Checkbox";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAttributeValueData,
  createAttributeValue,
  updateAttributeValuedata,
  deleteAttributeValuedata,
  clearError,
} from "../../store/slices/attributeValue.slice";
import { fetchAttributeData } from "../../store/slices/attibute.slice";
const emptyForm = {
  attribute: "",
  value: "",
  displayOrder: 0,
  isDefault: false,
  isActive: true,
};

function AttributeValues() {
  const [filter, setFilter] = useState({
    search: "",
    attribute: "",
    isActive: "",
    isDefault: "",
    page: 1,
    limit: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [values, setValues] = useState([""]);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const {
    data: rows,
    loading,
    error,
  } = useSelector((state) => state.attributeValue);
  const { data: attributes } = useSelector((state) => state.attribute);
  useEffect(() => {
    dispatch(fetchAttributeValueData(filter));
  }, [dispatch, filter]);
  useEffect(() => {
    if (attributes.length === 0) {
      dispatch(fetchAttributeData());
    }
  }, [dispatch, attributes.length]);
  const openAdd = () => {
    dispatch(clearError());
    setFormError("");
    setEditing(null);
    setForm(emptyForm);
    setValues([""]);
    setModalOpen(true);
  };
  const openEdit = (row) => {
    dispatch(clearError());
    setFormError("");
    setEditing(row);
    setForm({
      attribute: row.attribute?._id ?? row.attribute ?? "",
      value: row.value || "",
      displayOrder: row.displayOrder ?? 0,
      isDefault: row.isDefault ?? false,
      isActive: row.isActive ?? true,
    });
    setModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.attribute) {
      setFormError("Attribute is required");
      return;
    }
    const valuesToCreate = editing
      ? [form.value]
      : values.map((v) => v.trim()).filter(Boolean);
    if (!valuesToCreate.length) {
      setFormError("At least one value is required");
      return;
    }
    setSaving(true);
    try {
      const base = {
        attribute: form.attribute,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
        isDefault: form.isDefault,
      };
      if (editing) {
        await dispatch(
          updateAttributeValuedata({
            data: { ...base, value: form.value },
            id: editing._id,
          }),
        ).unwrap();
      } else {
        for (const value of valuesToCreate) {
          await dispatch(createAttributeValue({ ...base, value })).unwrap();
        }
      }
      // Only execute after successful API request
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setValues([""]);
    } catch (error) {
      console.log("Attribute value error:", error);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(deleteAttributeValuedata(deleteTarget._id)).unwrap();
      setDeleteTarget(null);
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };
  const attributeOptions = attributes.map((a) => ({
    value: a._id,
    label: a.name,
  }));
  const columns = [
    {
      key: "value",
      header: "Value",
      render: (row) => (
        <span className="font-medium text-ink">{row.value}</span>
      ),
    },
    { key: "slug", header: "Slug" },
    {
      key: "attribute",
      header: "Attribute",
      render: (row) => (
        <span className="text-ink-muted">
          {row.attribute?.name ?? row.attribute ?? "-"}
        </span>
      ),
    },
    { key: "displayOrder", header: "Order" },
    {
      key: "isDefault",
      header: "Default",
      render: (row) =>
        row.isDefault ? (
          <Badge tone="blue">Default</Badge>
        ) : (
          <span className="text-ink-muted">-</span>
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
        title="Attribute Values"
        description="Manage values for product attributes"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            Add Value
          </Button>
        }
      />
      <ErrorAlert message={formError || error} />
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="w-64">
          <Input
            id="search"
            label="Search"
            value={filter.search}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            placeholder="Search value..."
          />
        </div>

        <div className="w-52">
          <Select
            id="attributeFilter"
            label="Attribute"
            value={filter.attribute}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                attribute: e.target.value,
                page: 1,
              }))
            }
            options={attributeOptions}
            placeholder="All attributes"
          />
        </div>
        <div className="w-40">
          <Select
            id="statusFilter"
            label="Status"
            value={filter.isActive}
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                isActive: e.target.value,
                page: 1,
              }));
            }}
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            placeholder="All"
          />
        </div>

        <div className="w-40">
          <Select
            id="defaultFilter"
            label="Default"
            value={filter.isDefault}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                isDefault: e.target.value,
                page: 1,
              }))
            }
            options={[
              { value: "true", label: "Default" },
              { value: "false", label: "Not Default" },
            ]}
            placeholder="All"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No attribute values yet"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Attribute Value" : "Add Attribute Value"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" form="attribute-value-form" loading={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <form
          id="attribute-value-form"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Select
            id="attribute"
            label="Attribute"
            value={form.attribute}
            onChange={(e) =>
              setForm((p) => ({ ...p, attribute: e.target.value }))
            }
            options={attributeOptions}
            placeholder="Select an attribute"
            required
          />
          {editing ? (
            <Input
              id="value"
              label="Value"
              value={form.value}
              onChange={(e) =>
                setForm((p) => ({ ...p, value: e.target.value }))
              }
              placeholder="Red"
              required
            />
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Values
              </label>
              <div className="space-y-2">
                {values.map((v, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Input
                      id={`value-${i}`}
                      value={v}
                      onChange={(e) =>
                        setValues((prev) =>
                          prev.map((x, j) => (j === i ? e.target.value : x)),
                        )
                      }
                      placeholder="Red"
                      className="flex-1"
                    />
                    {values.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setValues((prev) =>
                            prev.filter((_, j) => j !== i),
                          )
                        }
                        aria-label="Remove value"
                        className="mt-1 rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setValues((prev) => [...prev, ""])}
                className="mt-2"
              >
                <Plus size={14} />
                Add value
              </Button>
            </div>
          )}
          <Input
            id="displayOrder"
            label="Display Order"
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))
            }
          />
          <div className="space-y-3">
            <Checkbox
              id="isDefault"
              checked={form.isDefault}
              onChange={(e) =>
                setForm((p) => ({ ...p, isDefault: e.target.checked }))
              }
              label="Default value"
            />
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onChange={(e) =>
                setForm((p) => ({ ...p, isActive: e.target.checked }))
              }
              label="Active"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete attribute value"
        message={`Are you sure you want to delete "${deleteTarget?.value}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default AttributeValues;
