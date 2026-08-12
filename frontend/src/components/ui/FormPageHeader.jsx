import { ArrowLeft } from "lucide-react";

function FormPageHeader({ title, description, backLabel, onBack }) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
      >
        <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
        {backLabel || "Back"}
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
      {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
    </div>
  );
}
export default FormPageHeader;
