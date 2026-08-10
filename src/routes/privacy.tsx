import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: pageMeta({
    title: "Privacy Policy",
    description: "Privacy Policy at Shri Grand Farm Stay, Baghpat.",
    path: "/privacy",
    }),
    links: canonical("/privacy"),
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Privacy</p>
        <h1 className="display-xl mt-5">Privacy Policy</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
