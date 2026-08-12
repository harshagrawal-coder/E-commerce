import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
import { TOAST_EVENT } from "../../utils/toast";

const config = {
  success: {
    icon: CheckCircle2,
    bar: "bg-emerald-500",
    iconColor: "text-emerald-600",
    border: "border-emerald-200",
  },
  error: {
    icon: XCircle,
    bar: "bg-red-500",
    iconColor: "text-red-600",
    border: "border-red-200",
  },
  info: {
    icon: AlertTriangle,
    bar: "bg-amber-500",
    iconColor: "text-amber-600",
    border: "border-amber-200",
  },
};

function ToastItem({ toast, onDismiss }) {
  const { type = "success" } = toast;
  const cfg = config[type] || config.success;
  const Icon = cfg.icon;

  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`glass-strong pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl px-4 py-3.5 shadow-float ${cfg.border}`}
      role="status"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${cfg.bar}`} aria-hidden="true" />
      <Icon size={18} className={`mt-0.5 shrink-0 ${cfg.iconColor}`} />
      <p className="flex-1 text-sm font-medium text-ink">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-md p-1 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const toast = e.detail;
      setToasts((prev) => [...prev.slice(-3), toast]);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Toaster;
