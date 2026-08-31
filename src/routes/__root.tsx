import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { site } from "@/config/site";
import { lodgingSchema, websiteSchema } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-32">
      <div className="max-w-lg text-center">
        <p className="eyebrow justify-center">404</p>
        <h1 className="display-xl mt-6">Looks like you took a wrong turn.</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          The page you are looking for doesn't exist or has moved. The road back
          is short.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-sm bg-primary px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-forest-deep"
          >
            Return home
          </Link>
          <Link
            to="/contact"
            className="rounded-sm border border-border px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-32">
      <div className="max-w-lg text-center">
        <h1 className="display-lg">This page didn't load</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Something went wrong on our end. Try again, or reach us directly on{" "}
          {site.contact.phoneDisplay}.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-sm bg-primary px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-sm border border-border px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${site.name} — ${site.tagline}` },
      { name: "description", content: site.description },
      { property: "og:site_name", content: site.name },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1f3b2c" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/img/logo/favicon-192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", href: "/img/logo/favicon-512.png", sizes: "512x512", type: "image/png" },
      { rel: "apple-touch-icon", href: "/img/logo/apple-touch-icon-180.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(lodgingSchema()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteSchema()),
      },
      // GA4 loader — no-op until `site.analytics.measurementId` is set (see
      // src/config/site.ts). Nothing loads or tracks until a real ID exists.
      ...(site.analytics.measurementId
        ? [
            {
              src: `https://www.googletagmanager.com/gtag/js?id=${site.analytics.measurementId}`,
              async: true,
            },
            {
              children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.analytics.measurementId}');`,
            },
          ]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-1">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </QueryClientProvider>
  );
}
