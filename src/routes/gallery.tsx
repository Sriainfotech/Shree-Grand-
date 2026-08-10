import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: pageMeta({
    title: "Gallery",
    description: "Gallery at Shri Grand Farm Stay, Baghpat.",
    path: "/gallery",
    }),
    links: canonical("/gallery"),
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Gallery</p>
        <h1 className="display-xl mt-5">Gallery</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
