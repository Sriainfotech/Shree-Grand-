import { createFileRoute, redirect } from "@tanstack/react-router";

// No route/link in this app ever points to /home — it isn't a real page.
// Something (an old backlink, a stale bookmark, a prior site structure)
// still sends traffic there though, and an unmatched route falling through
// to the error boundary was returning a non-200 status, which Google flags
// as a broken page. A permanent redirect to the real home page fixes both
// the user experience and the SEO signal.
export const Route = createFileRoute("/home")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
