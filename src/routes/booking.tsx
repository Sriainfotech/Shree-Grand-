import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: pageMeta({
    title: "Book Your Stay",
    description: "Book Your Stay at Shri Grand Farm Stay, Baghpat.",
    path: "/booking",
    }),
    links: canonical("/booking"),
  }),
  component: BookingPage,
});

function BookingPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Booking</p>
        <h1 className="display-xl mt-5">Book Your Stay</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
