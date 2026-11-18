import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Clock, MessageSquareText, XCircle } from "lucide-react";
import {
  listBookings,
  listInquiries,
  updateBookingStatus,
  updateInquiryStatus,
  type AdminBooking,
  type AdminInquiry,
} from "@/lib/adminApi";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { FullScreenLoader, LogoSpinner } from "@/components/ui/LogoSpinner";
import { cn } from "@/lib/utils";

// Not linked from any nav/footer, excluded from the sitemap, and marked
// noindex below — reachable only if you already know the URL.
export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminDashboardPage,
});

const bookingStatuses: AdminBooking["status"][] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];
const inquiryStatuses: AdminInquiry["status"][] = ["new", "contacted", "closed"];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Colour-codes status/payment values so the tables read at a glance instead
// of as a wall of identical text — reuses the brand palette (forest/gold/
// destructive) rather than inventing new colours.
const BADGE_STYLES: Record<string, string> = {
  pending: "bg-accent/15 text-accent-foreground border-accent/40",
  confirmed: "bg-primary/10 text-primary border-primary/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  completed: "bg-muted text-muted-foreground border-border",
  new: "bg-accent/15 text-accent-foreground border-accent/40",
  contacted: "bg-primary/10 text-primary border-primary/30",
  closed: "bg-muted text-muted-foreground border-border",
  unpaid: "bg-muted text-muted-foreground border-border",
  advance_paid: "bg-accent/15 text-accent-foreground border-accent/40",
  paid: "bg-primary/10 text-primary border-primary/30",
  refunded: "bg-destructive/10 text-destructive border-destructive/30",
};

function Badge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em]",
        BADGE_STYLES[value] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      {value.replace("_", " ")}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 border border-border bg-card p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <p className="text-2xl font-semibold leading-none text-foreground">{value}</p>
        <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatusSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (next: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-md border border-input bg-transparent px-2 py-1 text-xs capitalize"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function AdminDashboardPage() {
  const { user, ready } = useAdminGuard();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingList, inquiryList] = await Promise.all([listBookings(), listInquiries()]);
      setBookings(bookingList);
      setInquiries(inquiryList);
    } catch {
      setError("Couldn't load bookings/inquiries. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void loadData();
  }, [ready, loadData]);

  async function handleBookingStatus(id: string, status: AdminBooking["status"]) {
    const updated = await updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
  }

  async function handleInquiryStatus(id: string, status: AdminInquiry["status"]) {
    const updated = await updateInquiryStatus(id, status);
    setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }

  if (!ready) {
    return <FullScreenLoader />;
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  return (
    <AdminShell user={user}>
      <div className="space-y-12">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {loading ? (
          <div className="flex items-center gap-3 py-2">
            <LogoSpinner size={28} />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarCheck} label="Total bookings" value={bookings.length} />
          <StatCard icon={Clock} label="Awaiting confirmation" value={pendingBookings} />
          <StatCard icon={MessageSquareText} label="New inquiries" value={newInquiries} />
          <StatCard icon={XCircle} label="Cancelled" value={cancelledBookings} />
        </div>

        <section>
          <h2 className="display-lg mb-4">Bookings ({bookings.length})</h2>
          <div className="overflow-x-auto border border-border bg-card">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Check-in</th>
                  <th className="p-3">Guests</th>
                  <th className="p-3">Occasion</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Received</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-muted-foreground">
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border last:border-0">
                      <td className="p-3">
                        {b.name}
                        {b.email ? (
                          <span className="block text-xs text-muted-foreground">{b.email}</span>
                        ) : null}
                      </td>
                      <td className="p-3">{b.phone}</td>
                      <td className="p-3">{formatDate(b.checkIn)}</td>
                      <td className="p-3">{b.guests}</td>
                      <td className="p-3">{b.occasion ?? "-"}</td>
                      <td className="p-3">
                        <Badge value={b.paymentStatus} />
                      </td>
                      <td className="p-3">{formatDate(b.createdAt)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge value={b.status} />
                          <StatusSelect
                            value={b.status}
                            options={bookingStatuses}
                            onChange={(next) => void handleBookingStatus(b.id, next)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="display-lg mb-4">Inquiries ({inquiries.length})</h2>
          <div className="overflow-x-auto border border-border bg-card">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Occasion</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Received</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      No inquiries yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((i) => (
                    <tr key={i.id} className="border-b border-border last:border-0">
                      <td className="p-3">
                        {i.name}
                        {i.email ? (
                          <span className="block text-xs text-muted-foreground">{i.email}</span>
                        ) : null}
                      </td>
                      <td className="p-3">{i.phone}</td>
                      <td className="p-3">{i.occasion ?? "-"}</td>
                      <td className="max-w-xs p-3">{i.message || "-"}</td>
                      <td className="p-3">{formatDate(i.createdAt)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge value={i.status} />
                          <StatusSelect
                            value={i.status}
                            options={inquiryStatuses}
                            onChange={(next) => void handleInquiryStatus(i.id, next)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
