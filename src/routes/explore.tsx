import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: pageMeta({
    title: "Explore the Property in 3D",
    description: "Explore the Property in 3D at Shri Grand Farm Stay, Baghpat.",
    path: "/explore",
    }),
    links: canonical("/explore"),
  }),
  component: ExplorePage,
});

function ExplorePage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Explore 3D</p>
        <h1 className="display-xl mt-5">Explore the Property in 3D</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
