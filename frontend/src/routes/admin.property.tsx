import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property")({
  head: () => ({
    meta: [{ title: "Admin — Property" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: lazyRouteComponent(() => import("@/components/admin/pages/AdminPropertyPage")),
});
