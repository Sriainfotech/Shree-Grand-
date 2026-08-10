import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { navItems, NavLink } from "./nav-config";
import { MobileNav } from "./MobileNav";
import { telHref } from "@/config/site";
import { trackPhone } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur-sm"
          : "border-b border-transparent bg-background/70 backdrop-blur-sm",
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <NavLink to={item.to as never} label={item.label} />
                <div className="invisible absolute left-1/2 top-full z-50 min-w-56 -translate-x-1/2 pt-5 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="border border-border bg-card py-3 shadow-sm">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link
                          to={child.to as never}
                          className="block px-5 py-2 text-[0.78rem] tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <NavLink key={item.to} to={item.to as never} label={item.label} />
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={telHref}
            onClick={() => trackPhone("header")}
            aria-label="Call Shri Grand Farm Stay"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary sm:flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
          </a>
          <Link
            to="/booking"
            className="hidden rounded-sm bg-primary px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-forest-deep sm:inline-flex"
          >
            Book Now
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary xl:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
