import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: pageMeta({
    title: "Journal",
    description: "Journal at Shri Grand Farm Stay, Baghpat.",
    path: "/blog",
    }),
    links: canonical("/blog"),
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Journal</p>
        <h1 className="display-xl mt-5">Journal</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
