import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

// Not linked from any nav/footer, excluded from the sitemap, and marked
// noindex below — reachable only if you already know the URL.
//
// The page itself lives in src/components/admin/pages/ (not here) and is
// lazy-loaded: this keeps the whole admin dashboard — tables, API client,
// etc. — out of the bundle every public visitor downloads.
export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: lazyRouteComponent(() => import("@/components/admin/pages/AdminDashboardPage")),
});
