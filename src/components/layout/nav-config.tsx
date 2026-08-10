import { Link } from "@tanstack/react-router";
import { experiences } from "@/data/experiences";

export type NavChild = { label: string; to: string };
export type NavItem = { label: string; to: string; children?: NavChild[] };

export const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Stay",
    to: "/farm-stay",
    children: [
      { label: "The Farm Stay", to: "/farm-stay" },
      { label: "Rooms", to: "/rooms" },
      { label: "Facilities", to: "/facilities" },
      { label: "About", to: "/about" },
    ],
  },
  {
    label: "Experiences",
    to: "/experiences",
    children: experiences.map((e) => ({
      label: e.navLabel,
      to: `/experiences/${e.slug}`,
    })),
  },
  { label: "Explore 3D", to: "/explore" },
  { label: "Gallery", to: "/gallery" },
  { label: "Packages", to: "/packages" },
  { label: "Events", to: "/events" },
  { label: "Blog", to: "/blog" },
];

export const footerLinks: NavChild[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "The Farm Stay", to: "/farm-stay" },
  { label: "Rooms", to: "/rooms" },
  { label: "Facilities", to: "/facilities" },
  { label: "Experiences", to: "/experiences" },
  { label: "Explore 3D", to: "/explore" },
  { label: "Gallery", to: "/gallery" },
  { label: "Packages", to: "/packages" },
  { label: "Events", to: "/events" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
  { label: "Booking", to: "/booking" },
];

export const legalLinks: NavChild[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Cancellation Policy", to: "/cancellation-policy" },
];

export function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to as never}
      className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary"
      activeProps={{ className: "text-primary" }}
      activeOptions={{ exact: to === "/" }}
    >
      {label}
    </Link>
  );
}
