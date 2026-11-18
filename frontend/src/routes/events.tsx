import { createFileRoute, redirect } from "@tanstack/react-router";

// /events used to duplicate most of /experiences (weddings, corporate,
// birthdays, etc.) — folded into the /experiences category pages instead of
// kept as a separate, overlapping page. Redirect rather than 404 so any
// existing links/bookmarks/search results still land somewhere useful.
export const Route = createFileRoute("/events")({
  beforeLoad: () => {
    throw redirect({ to: "/experiences" });
  },
});
