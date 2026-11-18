import { Link } from "@tanstack/react-router";
import { experienceCategories } from "@/data/experience-categories";

export type NavChild = { label: string; to: string };
export type NavItem = { label: string; to: string; children?: NavChild[] };

export const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Stay",
    to: "/about",
    children: [
      { label: "About the Property", to: "/about" },
      { label: "Facilities", to: "/facilities" },
    ],
  },
  {
    label: "Experiences",
    to: "/experiences",
    children: experienceCategories.map((c) => ({
      label: c.name,
      to: `/experiences/${c.slug}`,
    })),
  },
  { label: "Gallery", to: "/gallery" },
  { label: "Packages", to: "/packages" },
  // "Explore 3D" and "Events" are intentionally left out of the header nav:
  // Explore 3D is folded into a section on /gallery until a real 3D
  // walkthrough exists (src/routes/explore.tsx stays live, just unlinked
  // from nav), and /events now redirects into /experiences (its content
  // duplicated the experience category pages).
  // "Blog" is intentionally left out too — the route and data stay live
  // (see src/routes/blog.tsx) but every post is still a draft outline, so
  // it isn't surfaced as a real destination yet. Add it back once real
  // articles are published.
  { label: "Contact", to: "/contact" },
];

export const footerLinks: NavChild[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Facilities", to: "/facilities" },
  { label: "Experiences", to: "/experiences" },
  { label: "Gallery", to: "/gallery" },
  { label: "Packages", to: "/packages" },
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
      className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary"
      activeProps={{ className: "text-primary" }}
      activeOptions={{ exact: to === "/" }}
    >
      {label}
    </Link>
  );
}
