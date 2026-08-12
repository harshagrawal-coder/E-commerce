export const formatINR = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const calcDiscountPercent = (mrp, selling) => {
  const m = Number(mrp || 0);
  const s = Number(selling || 0);
  if (m <= 0) return 0;
  return Math.round(((m - s) / m) * 100);
};

export const getId = (ref) => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return ref._id || "";
};

export const getName = (ref, fallback = "") => {
  if (!ref) return fallback;
  if (typeof ref === "string") return ref;
  return ref.name || ref.value || fallback;
};

export const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
