import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
    title: "Contact Us",
    description: "Contact Us at Shri Grand Farm Stay, Baghpat.",
    path: "/contact",
    }),
    links: canonical("/contact"),
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Contact</p>
        <h1 className="display-xl mt-5">Contact Us</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">This page is being prepared.</p>
      </div>
    </div>
  );
}
