import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

function ImageUpload({ label = "Image", onChange, previewUrl }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(previewUrl || "");
  const [prevPreviewUrl, setPrevPreviewUrl] = useState(previewUrl);

  if (previewUrl !== prevPreviewUrl) {
    setPrevPreviewUrl(previewUrl);
    setPreview(previewUrl || "");
  }

  const handleFile = (file) => {
    if (!file) return;
    onChange(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {label && (
        <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      )}
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-28 w-28 rounded-xl border border-border object-cover shadow-sm"
          />
          <button
            type="button"
            onClick={() => {
              setPreview("");
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white shadow-sm transition-transform duration-200 hover:scale-110"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-surface text-ink-muted transition-colors duration-200 hover:border-primary/50 hover:text-primary-600"
        >
          <ImagePlus size={20} />
          <span className="text-xs">Upload</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

export default ImageUpload;
