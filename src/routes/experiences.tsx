import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/experiences")({
  head: () => ({
    meta: pageMeta({
    title: "Experiences",
    description: "Experiences at Shri Grand Farm Stay, Baghpat.",
    path: "/experiences",
    }),
    links: canonical("/experiences"),
  }),
  component: ExperiencesPage,
});

function ExperiencesPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Experiences</p>
        <h1 className="display-xl mt-5">Experiences</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
