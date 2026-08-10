import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
    title: "About Shri Grand Farm Stay",
    description: "About Shri Grand Farm Stay at Shri Grand Farm Stay, Baghpat.",
    path: "/about",
    }),
    links: canonical("/about"),
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">About</p>
        <h1 className="display-xl mt-5">About Shri Grand Farm Stay</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
