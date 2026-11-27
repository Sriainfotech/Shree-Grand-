import { FormEvent, useEffect, useState } from "react";
import {
  getAdminProperty,
  updateProperty,
  type AdminProperty,
  type PropertyInput,
} from "@/lib/adminApi";
import { ApiRequestError } from "@/config/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { ImageListInput } from "@/components/admin/ImageInput";
import { FullScreenLoader } from "@/components/ui/LogoSpinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/** Comma-separated text <-> string[] helpers, used for images/amenities. */
const toCsv = (arr: string[] | undefined) => (arr ?? []).join(", ");
const fromCsv = (csv: string) =>
  csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function AdminPropertyPage() {
  const { user, ready } = useAdminGuard();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [form, setForm] = useState<PropertyInput>({});
  const [amenitiesCsv, setAmenitiesCsv] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!ready) return;
    getAdminProperty()
      .then((p) => {
        setProperty(p);
        setForm(p);
        setAmenitiesCsv(toCsv(p.amenities));
      })
      .catch(() => setError("Couldn't load property settings."))
      .finally(() => setLoading(false));
  }, [ready]);

  function update<K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateProperty({
        ...form,
        images: form.images ?? [],
        amenities: fromCsv(amenitiesCsv),
      });
      setProperty(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!ready || loading) {
    return <FullScreenLoader />;
  }

  return (
    <AdminShell user={user}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="display-lg">Property settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A booking is always for the whole property, never a particular room within it — these
            details and the day rate below are shown to guests before they book, and drive the
            full/advance payment amounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 border border-border bg-card p-6">
          <div className="space-y-1.5">
            <Label htmlFor="prop-name">Name</Label>
            <Input
              id="prop-name"
              required
              value={form.name ?? ""}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prop-desc">Description</Label>
            <Textarea
              id="prop-desc"
              rows={4}
              value={form.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What guests get when they book the whole property..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prop-guests">Guest capacity</Label>
              <Input
                id="prop-guests"
                type="number"
                min={1}
                value={form.guestCapacity ?? ""}
                onChange={(e) =>
                  update("guestCapacity", e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prop-price">Price per day (INR)</Label>
              <Input
                id="prop-price"
                type="number"
                min={0}
                value={form.pricePerDay ?? ""}
                onChange={(e) =>
                  update("pricePerDay", e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prop-price-label">Price label (shown when no day rate is set)</Label>
            <Input
              id="prop-price-label"
              value={form.priceLabel ?? ""}
              onChange={(e) => update("priceLabel", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Images</Label>
            <ImageListInput
              values={form.images ?? []}
              onChange={(images) => update("images", images)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prop-amenities">Amenities (comma-separated)</Label>
            <Input
              id="prop-amenities"
              value={amenitiesCsv}
              onChange={(e) => setAmenitiesCsv(e.target.value)}
              placeholder="Pool, AC rooms, Lawn, Party hall, Wi-Fi"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {saved ? <p className="text-sm text-primary">Saved.</p> : null}

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save property"}
          </Button>
        </form>

        {property && !property.pricePerDay ? (
          <p className="text-sm text-muted-foreground">
            No day rate is set yet — until it is, guests will see "{property.priceLabel}" and the
            booking form skips straight to the manual "we'll contact you" flow (no online payment).
          </p>
        ) : null}
      </div>
    </AdminShell>
  );
}
