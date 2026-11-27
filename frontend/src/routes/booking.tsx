import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: pageMeta({
      title: "Book Your Stay — Shri Grand Farm Stay, Mancherial",
      description:
        "How booking works at Shri Grand Farm Stay, Vempally, Mancherial, Telangana — book the whole property for your dates, pay 25% advance or in full online, 12:00 PM check-in.",
      path: "/booking",
    }),
    links: canonical("/booking"),
  }),
  component: lazyRouteComponent(() => import("@/components/booking/pages/BookingPage")),
});
