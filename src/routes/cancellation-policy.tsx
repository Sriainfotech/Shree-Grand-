import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({
    meta: pageMeta({
    title: "Cancellation Policy",
    description: "Cancellation Policy at Shri Grand Farm Stay, Baghpat.",
    path: "/cancellation-policy",
    }),
    links: canonical("/cancellation-policy"),
  }),
  component: CancellationPolicyPage,
});

function CancellationPolicyPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Cancellation</p>
        <h1 className="display-xl mt-5">Cancellation Policy</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
