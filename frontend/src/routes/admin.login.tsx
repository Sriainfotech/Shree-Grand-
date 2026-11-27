import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

// Not linked from any nav/footer, excluded from the sitemap, and marked
// noindex below — reachable only if you already know the URL.
export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Sign in" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: lazyRouteComponent(() => import("@/components/admin/pages/AdminLoginPage")),
});
