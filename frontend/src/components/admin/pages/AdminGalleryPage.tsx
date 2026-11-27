import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createGalleryImage,
  deleteGalleryImage,
  galleryCategories,
  listAdminGallery,
  updateGalleryImage,
  type AdminGalleryImage,
  type GalleryCategory,
} from "@/lib/adminApi";
import { API_URL, ApiRequestError } from "@/config/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FullScreenLoader, LogoSpinner } from "@/components/ui/LogoSpinner";

function imageUrl(url: string) {
  // Uploaded files are served from the backend at /uploads/... — the
  // frontend and backend are different origins, so this needs the API base.
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

function UploadForm({ onDone }: { onDone: () => void }) {
  const [source, setSource] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("pool");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (source === "file" && !file) {
      setError("Choose an image file first.");
      return;
    }
    if (source === "url" && !url.trim()) {
      setError("Paste an image URL first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createGalleryImage(source === "file" ? { file: file as File } : { url: url.trim() }, {
        category,
        title,
        caption,
      });
      setFile(null);
      setUrl("");
      setTitle("");
      setCaption("");
      onDone();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-border bg-card p-6">
      <div className="flex gap-1">
        {(["file", "url"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setSource(opt)}
            className={`rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              source === opt
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground"
            }`}
          >
            {opt === "file" ? "Upload a file" : "Paste a URL"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          {source === "file" ? (
            <>
              <Label htmlFor="gallery-file">Image file</Label>
              <Input
                id="gallery-file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </>
          ) : (
            <>
              <Label htmlFor="gallery-url">Image URL</Label>
              <Input
                id="gallery-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gallery-category">Category</Label>
          <select
            id="gallery-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as GalleryCategory)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            {galleryCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="gallery-title">Title (optional)</Label>
          <Input id="gallery-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gallery-caption">Caption (optional)</Label>
          <Input
            id="gallery-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Uploading..." : "Upload image"}
      </Button>
    </form>
  );
}

export default function AdminGalleryPage() {
  const { user, ready } = useAdminGuard();
  const [images, setImages] = useState<AdminGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setImages(await listAdminGallery());
    } catch {
      setError("Couldn't load gallery images.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  async function togglePublished(image: AdminGalleryImage) {
    const updated = await updateGalleryImage(image.id, { published: !image.published });
    setImages((prev) => prev.map((i) => (i.id === image.id ? updated : i)));
  }

  async function handleDelete(image: AdminGalleryImage) {
    if (!window.confirm("Delete this image? This can't be undone.")) return;
    await deleteGalleryImage(image.id);
    await load();
  }

  if (!ready) {
    return <FullScreenLoader />;
  }

  const visible = filter === "all" ? images : images.filter((i) => i.category === filter);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="display-lg">Gallery ({images.length})</h2>
          <Button onClick={() => setShowUpload((v) => !v)}>
            {showUpload ? "Close" : "Upload image"}
          </Button>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {loading ? (
          <div className="flex items-center gap-3 py-2">
            <LogoSpinner size={28} />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : null}

        {showUpload ? (
          <UploadForm
            onDone={() => {
              setShowUpload(false);
              void load();
            }}
          />
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full border px-3 py-1 text-xs ${filter === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
          >
            All
          </button>
          {galleryCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3 py-1 text-xs capitalize ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.length === 0 ? (
            <p className="col-span-full p-6 text-center text-sm text-muted-foreground">
              No images in this category yet.
            </p>
          ) : (
            visible.map((image) => (
              <div key={image.id} className="border border-border bg-card">
                <img
                  src={imageUrl(image.url)}
                  alt={image.title || image.category}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-2 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {image.category}
                  </p>
                  {image.title ? <p className="text-sm">{image.title}</p> : null}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => void togglePublished(image)}
                      className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
                    >
                      {image.published ? "Published" : "Hidden"} — toggle
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(image)}
                      className="text-xs font-semibold uppercase tracking-wide text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
