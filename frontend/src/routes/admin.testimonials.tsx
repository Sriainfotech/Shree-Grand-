import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [{ title: "Admin — Testimonials" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: lazyRouteComponent(() => import("@/components/admin/pages/AdminTestimonialsPage")),
});
