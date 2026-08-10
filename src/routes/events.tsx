import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: pageMeta({
    title: "Events & Celebrations",
    description: "Events & Celebrations at Shri Grand Farm Stay, Baghpat.",
    path: "/events",
    }),
    links: canonical("/events"),
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Events</p>
        <h1 className="display-xl mt-5">Events & Celebrations</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
