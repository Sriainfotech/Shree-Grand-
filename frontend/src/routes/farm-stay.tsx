import { createFileRoute, redirect } from "@tanstack/react-router";

// /farm-stay's content (property overview, accommodation, outdoor,
// celebration, dining/recreation, facilities-by-area) has been merged into
// /about to stop the same property description repeating across three
// pages. Redirect rather than 404 so existing links/bookmarks still land
// somewhere useful.
export const Route = createFileRoute("/farm-stay")({
  beforeLoad: () => {
    throw redirect({ to: "/about" });
  },
});
