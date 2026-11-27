import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createBlogPost,
  deleteBlogPost,
  listAdminBlogPosts,
  updateBlogPost,
  type AdminBlogPost,
  type BlogPostInput,
} from "@/lib/adminApi";
import { ApiRequestError } from "@/config/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { ImageUrlInput } from "@/components/admin/ImageInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FullScreenLoader, LogoSpinner } from "@/components/ui/LogoSpinner";

const emptyForm: BlogPostInput = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  image: "",
  status: "draft",
  seoTitle: "",
  seoDescription: "",
};

function BlogForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: BlogPostInput;
  onSubmit: (input: BlogPostInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BlogPostInput>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border border-border bg-card p-6">
      <div className="space-y-1.5">
        <Label htmlFor="post-title">Title</Label>
        <Input
          id="post-title"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="post-category">Category</Label>
          <Input
            id="post-category"
            value={form.category ?? ""}
            onChange={(e) => update("category", e.target.value)}
            placeholder="weddings, weekend-getaways..."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="post-status">Status</Label>
          <select
            id="post-status"
            value={form.status ?? "draft"}
            onChange={(e) => update("status", e.target.value as "draft" | "published")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-image">Image</Label>
        <ImageUrlInput
          id="post-image"
          value={form.image ?? ""}
          onChange={(url) => update("image", url)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-excerpt">Excerpt</Label>
        <Textarea
          id="post-excerpt"
          rows={2}
          value={form.excerpt ?? ""}
          onChange={(e) => update("excerpt", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-content">Content</Label>
        <Textarea
          id="post-content"
          rows={8}
          value={form.content ?? ""}
          onChange={(e) => update("content", e.target.value)}
          placeholder="Full article body (Markdown or HTML, rendered by the frontend)"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="post-seo-title">SEO title</Label>
          <Input
            id="post-seo-title"
            value={form.seoTitle ?? ""}
            onChange={(e) => update("seoTitle", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="post-seo-desc">SEO description</Label>
          <Input
            id="post-seo-desc"
            value={form.seoDescription ?? ""}
            onChange={(e) => update("seoDescription", e.target.value)}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save post"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AdminBlogPage() {
  const { user, ready } = useAdminGuard();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPosts(await listAdminBlogPosts());
    } catch {
      setError("Couldn't load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  async function handleCreate(input: BlogPostInput) {
    await createBlogPost(input);
    setCreating(false);
    await load();
  }

  async function handleUpdate(id: string, input: BlogPostInput) {
    await updateBlogPost(id, input);
    setEditingId(null);
    await load();
  }

  async function handleDelete(post: AdminBlogPost) {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    await deleteBlogPost(post.id);
    await load();
  }

  if (!ready) {
    return <FullScreenLoader />;
  }

  const editingPost = posts.find((p) => p.id === editingId) ?? null;

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="display-lg">Blog posts ({posts.length})</h2>
          {!creating ? (
            <Button
              onClick={() => {
                setCreating(true);
                setEditingId(null);
              }}
            >
              New post
            </Button>
          ) : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {loading ? (
          <div className="flex items-center gap-3 py-2">
            <LogoSpinner size={28} />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : null}

        {creating ? (
          <BlogForm
            initial={emptyForm}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        ) : null}

        {editingPost ? (
          <BlogForm
            key={editingPost.id}
            initial={{
              ...editingPost,
              category: editingPost.category ?? "",
              image: editingPost.image ?? "",
              seoTitle: editingPost.seoTitle ?? "",
              seoDescription: editingPost.seoDescription ?? "",
            }}
            onSubmit={(input) => handleUpdate(editingPost.id, input)}
            onCancel={() => setEditingId(null)}
          />
        ) : null}

        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No posts yet — write the first one above.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0">
                    <td className="p-3">{post.title}</td>
                    <td className="p-3">{post.category ?? "-"}</td>
                    <td className="p-3 capitalize">{post.status}</td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
                          onClick={() => {
                            setEditingId(post.id);
                            setCreating(false);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold uppercase tracking-wide text-destructive hover:underline"
                          onClick={() => void handleDelete(post)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
