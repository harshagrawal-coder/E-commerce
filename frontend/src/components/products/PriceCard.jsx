import { IndianRupee, TrendingDown, BadgePercent } from "lucide-react";
import Card from "../ui/Card";
import { calcDiscountPercent, formatINR } from "../../utils/format";

function PriceInput({ id, label, value, onChange, error, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
          <IndianRupee size={15} />
        </span>
        <input
          id={id}
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={[
            "h-11 w-full rounded-xl border bg-white/90 pl-9 pr-3.5 text-sm font-medium text-ink",
            "shadow-card transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-0",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/15",
          ].join(" ")}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  );
}

function PriceCard({ mrp, sellingPrice, costPrice, onChange, errors = {} }) {
  const mrpNum = Number(mrp || 0);
  const sellingNum = Number(sellingPrice || 0);
  const discount = calcDiscountPercent(mrpNum, sellingNum);
  const sellingExceeds = sellingNum > mrpNum && mrpNum > 0;

  return (
    <Card
      title="Pricing"
      description="Set the pricing for this variant"
      icon={IndianRupee}
      className="h-full"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <PriceInput
          id="mrp"
          label="MRP"
          value={mrp}
          onChange={(v) => onChange("mrp", v)}
          error={errors.mrp}
        />
        <PriceInput
          id="sellingPrice"
          label="Selling Price"
          value={sellingPrice}
          onChange={(v) => onChange("sellingPrice", v)}
          error={sellingExceeds ? "Selling price cannot exceed MRP" : errors.sellingPrice}
        />
        <PriceInput
          id="costPrice"
          label="Cost Price"
          value={costPrice}
          onChange={(v) => onChange("costPrice", v)}
          hint="Optional · your purchase cost"
        />
      </div>

      <div
        className={`mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3.5 ${
          sellingExceeds
            ? "border-red-200 bg-red-50"
            : discount > 0
              ? "border-green-200 bg-green-50"
              : "border-border bg-surface/60"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              sellingExceeds
                ? "bg-red-100 text-red-600"
                : discount > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {sellingExceeds ? <TrendingDown size={15} /> : <BadgePercent size={15} />}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Discount</p>
            <p
              className={`text-sm font-semibold ${
                sellingExceeds ? "text-red-600" : discount > 0 ? "text-green-700" : "text-ink"
              }`}
            >
              {sellingExceeds
                ? "Selling price exceeds MRP"
                : discount > 0
                  ? `${discount}% off`
                  : "No discount"}
            </p>
          </div>
        </div>
        {discount > 0 && !sellingExceeds && (
          <div className="text-right">
            <p className="text-xs text-ink-muted">You save</p>
            <p className="text-sm font-semibold text-green-700">
              {formatINR(mrpNum - sellingNum)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default PriceCard;
