import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { clearToken, type AdminUser } from "@/lib/adminApi";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Bookings & Inquiries", to: "/admin" },
  { label: "Property", to: "/admin/property" },
  { label: "Gallery", to: "/admin/gallery" },
  { label: "Blog", to: "/admin/blog" },
  { label: "Testimonials", to: "/admin/testimonials" },
];

export function AdminShell({ user, children }: { user: AdminUser | null; children: ReactNode }) {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    void navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-dvh bg-secondary/30">
      {/* Same dark-forest-over-photo treatment as the public site's page
          heroes (see PageHero in ui/page.tsx) — ties the admin panel back
          to the brand instead of a flat, empty-looking bar. */}
      <header className="relative isolate overflow-hidden bg-forest-deep text-primary-foreground">
        <img
          src={images.aerial}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep via-forest-deep/95 to-forest/80"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-6 pt-7">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent">
              Shri Grand Farm Stay
            </p>
            <h1 className="display-lg mt-2 text-primary-foreground">Admin</h1>
            {user ? (
              <p className="mt-1 text-sm text-primary-foreground/70">
                Signed in as {user.name} ({user.username}) — {user.role}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-sm border border-accent/60 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Log out
          </button>
        </div>
        <nav className="flex flex-wrap gap-1 px-6 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-sm px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground",
              )}
              activeProps={{ className: "!bg-accent !text-accent-foreground" }}
              activeOptions={{ exact: item.to === "/admin" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
