import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: pageMeta({
    title: "Terms & Conditions",
    description: "Terms & Conditions at Shri Grand Farm Stay, Baghpat.",
    path: "/terms",
    }),
    links: canonical("/terms"),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Terms</p>
        <h1 className="display-xl mt-5">Terms & Conditions</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
