import { ChevronDown } from "lucide-react";
import AttributeIcon from "./AttributeIcon";
import { colorHex } from "../../utils/colorValue";

function DynamicAttributeField({ config, value = "", onChange, error, required = false }) {
  const attribute = config.attribute || {};
  const allowedValues = Array.isArray(config.allowedValues) ? config.allowedValues : [];
  const selected = allowedValues.find((v) => v._id === value);
  const selectedHex = colorHex(selected?.value);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 text-primary shadow-card">
          <AttributeIcon name={attribute.name} />
        </span>
        <label htmlFor={`attr-${attribute._id}`} className="text-sm font-medium text-ink">
          {attribute.name}
        </label>
        {required && <span className="text-red-500">*</span>}
        {selectedHex && (
          <span
            className="ml-1 h-3 w-3 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: selectedHex }}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="relative">
        <select
          id={`attr-${attribute._id}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "h-11 w-full appearance-none rounded-xl border bg-white/90 pl-3.5 pr-10 text-sm text-ink",
            "shadow-card transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-0",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/15",
          ].join(" ")}
        >
          <option value="">Select {attribute.name || "attribute"}</option>
          {allowedValues.map((v) => (
            <option key={v._id} value={v._id}>
              {v.value}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p className="mt-1.5 animate-fade-in text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

export default DynamicAttributeField;
