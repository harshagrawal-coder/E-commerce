import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CloudUpload,
  ImagePlus,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Check,
} from "lucide-react";

function ImageThumb({ item, index, total, isPrimary, onRemove, onSetPrimary, onMove, onAltChange, onDrop, onDragStart, onDragOver, onDragEnd }) {
  const [preview] = useState(() => {
    if (item.file) return URL.createObjectURL(item.file);
    return item.url || "";
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -4 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group relative w-[120px] shrink-0 rounded-xl border bg-white p-2 shadow-card transition-all duration-200 ${
        isPrimary
          ? "border-primary/40 ring-2 ring-primary/15"
          : "border-border hover:border-primary/40 hover:shadow-raised"
      }`}
    >
      <div className="relative h-24 w-full overflow-hidden rounded-lg bg-surface">
        {preview ? (
          <img src={preview} alt={item.alt || `Image ${index + 1}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-muted">
            <ImagePlus size={20} />
          </div>
        )}
        {isPrimary && (
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            <Star size={9} fill="currentColor" />
            Primary
          </span>
        )}
        <div className="absolute right-1.5 top-1.5 flex flex-col gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove image"
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/95 text-red-600 shadow-sm transition-colors hover:bg-red-600 hover:text-white"
          >
            <Trash2 size={12} />
          </button>
          {!isPrimary && (
            <button
              type="button"
              onClick={onSetPrimary}
              aria-label="Set as primary image"
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/95 text-amber-500 shadow-sm transition-colors hover:bg-amber-500 hover:text-white"
            >
              <Star size={12} />
            </button>
          )}
        </div>
        <span className="absolute inset-0 flex cursor-grab items-center justify-center bg-ink/0 text-white opacity-0 transition-all duration-200 group-hover:bg-ink/30 group-hover:opacity-100">
          <GripVertical size={16} />
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-1">
        <input
          type="text"
          value={item.alt || ""}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Alt text"
          className="w-full min-w-0 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary/40 focus:bg-white focus:outline-none"
        />
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
            aria-label="Move left"
            className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft size={12} />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
            aria-label="Move right"
            className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductImageUploader({ images = [], onChange, max = 8 }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const addFiles = useCallback(
    (files) => {
      const valid = Array.from(files || []).filter((f) => f.type?.startsWith("image/"));
      if (!valid.length) return;
      const next = [...images];
      for (const file of valid) {
        if (next.length >= max) break;
        next.push({ key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, file, alt: "" });
      }
      onChange(next);
    },
    [images, onChange, max],
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setDragIndex(null);
    addFiles(e.dataTransfer?.files);
  };

  const reorder = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const removeAt = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setPrimary = (index) => {
    if (index === 0) return;
    const next = [...images];
    const [moved] = next.splice(index, 1);
    next.unshift(moved);
    onChange(next);
  };

  const updateAlt = (index, alt) => {
    const next = [...images];
    next[index] = { ...next[index], alt };
    onChange(next);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          "relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200",
          dragOver
            ? "scale-[1.01] border-primary bg-primary-50/70 shadow-primary"
            : "border-border bg-gradient-to-b from-surface/70 to-primary-50/30 hover:border-primary/50 hover:bg-primary-50/40",
        ].join(" ")}
      >
        <motion.div
          animate={dragOver ? { scale: 1.08, rotate: -4 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-card transition-colors duration-200 ${
            dragOver ? "bg-primary text-white" : "bg-white text-primary"
          }`}
        >
          <CloudUpload size={24} strokeWidth={1.8} />
        </motion.div>
        <div>
          <p className="text-sm font-semibold text-ink">
            {dragOver ? "Drop images here" : "Drag & drop images here"}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            PNG, JPG or WEBP · up to {max} images
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-medium text-primary shadow-card">
          <ImagePlus size={12} />
          Browse files
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {images.length} {images.length === 1 ? "image" : "images"}
            </p>
            {images.length > 0 && (
              <p className="inline-flex items-center gap-1 text-xs text-ink-muted">
                <Check size={12} className="text-primary" />
                First image is primary
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <ImageThumb
                key={img.key || img.url || i}
                item={img}
                index={i}
                total={images.length}
                isPrimary={i === 0}
                onRemove={() => removeAt(i)}
                onSetPrimary={() => setPrimary(i)}
                onMove={(from, to) => reorder(from, to)}
                onAltChange={(alt) => updateAlt(i, alt)}
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={() => setDragIndex(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== i) reorder(dragIndex, i);
                  setDragIndex(null);
                }}
              />
            ))}
            {images.length < max && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-[176px] w-[120px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-surface/40 text-ink-muted transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ImagePlus size={18} />
                <span className="text-xs">Add more</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductImageUploader;
