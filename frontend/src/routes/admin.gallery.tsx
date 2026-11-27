import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [{ title: "Admin — Gallery" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: lazyRouteComponent(() => import("@/components/admin/pages/AdminGalleryPage")),
});
