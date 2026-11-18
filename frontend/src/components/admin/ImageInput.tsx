import { useRef, useState } from "react";
import { X, Upload, Loader2, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/adminApi";
import { ApiRequestError } from "@/config/api";

/** Shared "paste a URL, or upload a file — your choice" control used by any
 * admin image field. Uploading fills the same URL box a pasted link would. */
function useImageUpload(onUploaded: (url: string) => void) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadImage(file);
      onUploaded(url);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return { fileRef, uploading, error, handleFile };
}

/** A single image field: paste a URL, or click Upload to pick a file —
 * whichever the admin prefers. Shows a small preview once there's a value. */
export function ImageUrlInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string | undefined;
}) {
  const { fileRef, uploading, error, handleFile } = useImageUpload(onChange);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://... or /uploads/..."}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {value ? (
        <img
          src={value}
          alt=""
          className="h-20 w-20 rounded-sm border border-border object-cover"
        />
      ) : null}
    </div>
  );
}

/** A list of image URLs — add each one either by pasting a URL or uploading
 * a file, remove any with the × on its thumbnail. Used wherever a form
 * needs several images (e.g. Property). */
export function ImageListInput({
  values,
  onChange,
}: {
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const [draftUrl, setDraftUrl] = useState("");
  const { fileRef, uploading, error, handleFile } = useImageUpload((url) =>
    onChange([...values, url]),
  );

  function addDraft() {
    const url = draftUrl.trim();
    if (!url) return;
    onChange([...values, url]);
    setDraftUrl("");
  }

  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {values.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative">
              <img
                src={url}
                alt=""
                className="h-20 w-20 rounded-sm border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove image"
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-destructive hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageOff className="h-3.5 w-3.5" aria-hidden />
          No images yet.
        </p>
      )}

      <div className="flex gap-2">
        <Input
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addDraft();
            }
          }}
          placeholder="Paste an image URL..."
        />
        <Button type="button" variant="outline" onClick={addDraft} disabled={!draftUrl.trim()}>
          Add
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
