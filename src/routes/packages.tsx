import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: pageMeta({
    title: "Packages",
    description: "Packages at Shri Grand Farm Stay, Baghpat.",
    path: "/packages",
    }),
    links: canonical("/packages"),
  }),
  component: PackagesPage,
});

function PackagesPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Packages</p>
        <h1 className="display-xl mt-5">Packages</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
