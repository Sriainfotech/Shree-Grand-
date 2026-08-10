import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/farm-stay")({
  head: () => ({
    meta: pageMeta({
    title: "The Farm Stay",
    description: "The Farm Stay at Shri Grand Farm Stay, Baghpat.",
    path: "/farm-stay",
    }),
    links: canonical("/farm-stay"),
  }),
  component: FarmStayPage,
});

function FarmStayPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">The Farm Stay</p>
        <h1 className="display-xl mt-5">The Farm Stay</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
