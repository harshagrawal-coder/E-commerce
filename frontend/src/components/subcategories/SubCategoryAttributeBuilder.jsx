import { useState } from "react";
import { Plus, Trash2, Tags, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Checkbox from "../ui/Checkbox";
import Input from "../ui/Input";
import { colorHex } from "../../utils/colorValue";
import { fetchAttributeValues } from "../../services/attributeValue.api";

const emptyAttributeRow = {
  attribute: "",
  allowedValues: [],
  required: false,
  isVariant: false,
  isFilterable: true,
  isVisible: true,
  displayOrder: 0,
};

function SubCategoryAttributeBuilder({ rows, onChange, attributes }) {
  const [valueCache, setValueCache] = useState({});
  const [loadingValues, setLoadingValues] = useState({});

  const loadValues = async (attrId) => {
    if (!attrId) return;
    if (valueCache[attrId] || loadingValues[attrId]) return;

    setLoadingValues((prev) => ({ ...prev, [attrId]: true }));
    try {
      const response = await fetchAttributeValues({
        params: { attribute: attrId, limit: 100 },
      });
      setValueCache((prev) => ({ ...prev, [attrId]: response.data || [] }));
    } catch {
      setValueCache((prev) => ({ ...prev, [attrId]: [] }));
    } finally {
      setLoadingValues((prev) => ({ ...prev, [attrId]: false }));
    }
  };

  const updateRow = (index, patch) =>
    onChange((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );

  const removeRow = (index) =>
    onChange((prev) => prev.filter((_, i) => i !== index));

  const toggleValue = (index, valueId) =>
    onChange((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;
        const has = r.allowedValues.includes(valueId);
        return {
          ...r,
          allowedValues: has
            ? r.allowedValues.filter((v) => v !== valueId)
            : [...r.allowedValues, valueId],
        };
      }),
    );

  const selectedAttributeIds = rows
    .filter((r) => r.attribute)
    .map((r) => r.attribute.toString());

  const addRow = () => onChange((prev) => [...prev, { ...emptyAttributeRow }]);

  return (
    <div className="rounded-2xl border border-primary/15 bg-gradient-to-b from-primary-50/60 to-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-card">
            <Tags size={15} strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Attributes</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Pick attributes and values that will show up when creating
              products and variants for this sub-category.
            </p>
          </div>
        </div>
        <Button size="sm" variant="secondary" type="button" onClick={addRow}>
          <Plus size={15} />
          Add
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-primary/20 bg-white px-4 py-6 text-center text-sm text-ink-muted">
          No attributes connected yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row, i) => {
            const attrId = row.attribute?.toString?.() ?? row.attribute ?? "";
            const values = attrId ? valueCache[attrId] || [] : [];
            const loading = attrId ? loadingValues[attrId] : false;
            const isDuplicate =
              !!attrId &&
              selectedAttributeIds.indexOf(attrId) !==
                selectedAttributeIds.lastIndexOf(attrId);

            return (
              <div
                key={i}
                className="rounded-xl border border-border bg-white p-3 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      id={`attr-select-${i}`}
                      value={row.attribute}
                      onChange={(e) => {
                        const next = e.target.value;
                        updateRow(i, { attribute: next, allowedValues: [] });
                        loadValues(next);
                      }}
                      options={attributes.map((a) => ({
                        value: a._id,
                        label: a.name,
                      }))}
                      placeholder="Select an attribute"
                    />
                    {isDuplicate && (
                      <p className="mt-1 animate-fade-in text-xs font-medium text-red-600">
                        This attribute is already connected above.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    aria-label="Remove attribute"
                    className="shrink-0 rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {attrId && (
                  <>
                    <div className="mt-3">
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Allowed values
                      </p>
                      {loading ? (
                        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                          <Loader2 size={14} className="animate-spin" />
                          Loading values…
                        </p>
                      ) : values.length ? (
                        <div className="flex flex-wrap gap-2">
                          {values.map((v) => {
                            const hex = colorHex(v.value);
                            const selected = row.allowedValues.includes(v._id);
                            return (
                              <button
                                key={v._id}
                                type="button"
                                onClick={() => toggleValue(i, v._id)}
                                aria-pressed={selected}
                                className={[
                                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
                                  selected
                                    ? "border-primary/40 bg-primary-50 text-primary-700 shadow-card"
                                    : "border-border bg-surface text-ink-muted hover:border-primary/30 hover:text-ink",
                                ].join(" ")}
                              >
                                {hex && (
                                  <span
                                    className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
                                    style={{ backgroundColor: hex }}
                                    aria-hidden="true"
                                  />
                                )}
                                {v.value}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-ink-muted">
                          No values exist for this attribute yet.
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <Checkbox
                        id={`req-${i}`}
                        checked={row.required}
                        onChange={(e) =>
                          updateRow(i, { required: e.target.checked })
                        }
                        label="Required"
                      />
                      <Checkbox
                        id={`variant-${i}`}
                        checked={row.isVariant}
                        onChange={(e) =>
                          updateRow(i, { isVariant: e.target.checked })
                        }
                        label="Variant attribute"
                      />
                      <Checkbox
                        id={`filterable-${i}`}
                        checked={row.isFilterable}
                        onChange={(e) =>
                          updateRow(i, { isFilterable: e.target.checked })
                        }
                        label="Filterable"
                      />
                      <Checkbox
                        id={`visible-${i}`}
                        checked={row.isVisible}
                        onChange={(e) =>
                          updateRow(i, { isVisible: e.target.checked })
                        }
                        label="Visible"
                      />
                      <div className="w-24">
                        <Input
                          id={`order-${i}`}
                          type="number"
                          min={0}
                          value={row.displayOrder ?? 0}
                          onChange={(e) =>
                            updateRow(i, {
                              displayOrder: Number(e.target.value) || 0,
                            })
                          }
                          placeholder="Order"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubCategoryAttributeBuilder;
