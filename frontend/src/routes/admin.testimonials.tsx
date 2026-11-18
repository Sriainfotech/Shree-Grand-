import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createTestimonial,
  deleteTestimonial,
  listAdminTestimonials,
  updateTestimonial,
  type AdminTestimonial,
  type TestimonialInput,
} from "@/lib/adminApi";
import { ApiRequestError } from "@/config/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FullScreenLoader, LogoSpinner } from "@/components/ui/LogoSpinner";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [{ title: "Admin — Testimonials" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminTestimonialsPage,
});

const emptyForm: TestimonialInput = { name: "", review: "", role: "" };

function AddForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState<TestimonialInput>(emptyForm);
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof TestimonialInput>(key: K, value: TestimonialInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // The create endpoint always starts a testimonial unpublished, even for
      // admin-entered ones — publishing is always this explicit second step.
      const created = await createTestimonial(form);
      if (publishImmediately) {
        await updateTestimonial(created.id, { published: true });
      }
      onDone();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="t-name">Guest name</Label>
          <Input
            id="t-name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="t-role">Role / source (optional)</Label>
          <Input
            id="t-role"
            value={form.role ?? ""}
            onChange={(e) => update("role", e.target.value)}
            placeholder="Wedding guest, Hyderabad"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-review">Review</Label>
        <Textarea
          id="t-review"
          required
          rows={3}
          value={form.review}
          onChange={(e) => update("review", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-rating">Rating (1-5, optional)</Label>
        <Input
          id="t-rating"
          type="number"
          min={1}
          max={5}
          value={form.rating ?? ""}
          onChange={(e) => update("rating", e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={publishImmediately}
          onChange={(e) => setPublishImmediately(e.target.checked)}
        />
        Publish immediately
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Add testimonial"}
      </Button>
    </form>
  );
}

function AdminTestimonialsPage() {
  const { user, ready } = useAdminGuard();
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTestimonials(await listAdminTestimonials());
    } catch {
      setError("Couldn't load testimonials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  async function toggle(t: AdminTestimonial, field: "published" | "featured") {
    const updated = await updateTestimonial(t.id, { [field]: !t[field] });
    setTestimonials((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
  }

  async function handleDelete(t: AdminTestimonial) {
    if (!window.confirm(`Delete the review from "${t.name}"? This can't be undone.`)) return;
    await deleteTestimonial(t.id);
    await load();
  }

  if (!ready) {
    return <FullScreenLoader />;
  }

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="display-lg">Testimonials ({testimonials.length})</h2>
          <Button onClick={() => setShowAdd((v) => !v)}>{showAdd ? "Close" : "Add review"}</Button>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {loading ? (
          <div className="flex items-center gap-3 py-2">
            <LogoSpinner size={28} />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : null}

        {showAdd ? (
          <AddForm
            onDone={() => {
              setShowAdd(false);
              void load();
            }}
          />
        ) : null}

        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Review</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Published</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No testimonials yet.
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="p-3">
                      {t.name}
                      {t.role ? (
                        <span className="block text-xs text-muted-foreground">{t.role}</span>
                      ) : null}
                    </td>
                    <td className="max-w-sm p-3">{t.review}</td>
                    <td className="p-3">{t.rating ?? "-"}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => void toggle(t, "published")}
                        className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
                      >
                        {t.published ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => void toggle(t, "featured")}
                        className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
                      >
                        {t.featured ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => void handleDelete(t)}
                        className="text-xs font-semibold uppercase tracking-wide text-destructive hover:underline"
                      >
                        Delete
                      </button>
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
