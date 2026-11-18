# Shri Grand Farm Stay — Implementation Plan

Confirmed from the uploaded document: name, tagline, Vempally/Mancherial/Telangana, landmark "Near Vempally Municipality Office line", mobile & WhatsApp 9014007174, email shreegrandfarmstay@gmail.com, Instagram Shreegrandfarmstay, 14 facilities, 11 services, 7 audiences, 50% advance, online + offline payment, check-in 12:00 PM / check-out 10:00 AM, capacity "based on party", online booking + WhatsApp required. Everything else stays a configurable placeholder.

## 1. Sitemap

```text
/                     /about            /farm-stay        /rooms
/facilities           /experiences      /experiences/$slug (10 pages)
/events               /explore (3D)     /gallery          /packages
/booking              /blog             /blog/$slug       /contact
/privacy  /terms  /cancellation-policy  (placeholder legal)
/admin/* (phase 7: dashboard, bookings, calendar, leads, packages,
          rooms, gallery, blog, testimonials, settings)
```

Multi-page routing via TanStack Router file routes. Each public page gets its own title, description, canonical, OG/Twitter tags and JSON-LD.

## 2. Component architecture

- `src/config/site.ts` — single source for contact, hours, booking rules, social, WhatsApp templates. No hard-coded contact details in components.
- `src/data/` — facilities, services/experiences, packages, rooms, gallery, testimonials, blog. Typed shapes mirroring future DB tables, so a Cloud swap is a one-file change.
- `src/components/layout/` — Header, MobileDrawer, Footer, floating WhatsApp button, page shell.
- `src/components/ui/` — section header, image frame, editorial card, badge, chip, stat, CTA band, lightbox, stepper, empty/error/loading states.
- `src/components/3d/` — PropertyScene, PropertyModel, Hotspot, CameraController, Environment, DayNightController, FallbackScene.
- `src/lib/analytics.ts` — typed event emitter (GA4-ready, no-ops until an ID is configured).
- `src/lib/seo.ts` — metadata + JSON-LD builders.

## 3. Design system

Tokens in `src/styles.css` (oklch): deep forest green primary, warm ivory background, muted champagne accent, deep charcoal/brown text. Serif display (Cormorant Garamond) + Manrope body, loaded via `<link>` in the root route. Restrained radii, soft depth instead of heavy shadows, slow fade/reveal motion honouring `prefers-reduced-motion`. No gradients, glass, or neon.

## 4. Database entities (schema designed now, tables created in Phase 5)

`bookings`, `inquiries` (leads), `packages`, `rooms`, `facilities`, `gallery_items`, `testimonials`, `blog_posts`, `blocked_dates`, `settings` (advance %, policies, contact overrides), `user_roles` (admin, separate table). Bookings carry the full field list from the brief, with booking/payment status enums.

## 5. 3D architecture

`/explore` only, lazy-loaded via React Three Fiber + drei. Until a real GLB exists at `public/models/shri-grand-farmstay.glb`, an abstract massing/landscape placeholder renders, labelled "3D Preview — Concept Visualization". Hotspot registry drives camera transitions and an info panel; day/night is a scene-state toggle; WebGL-absent or mobile-constrained devices get a static fallback. All hotspot content also exists as HTML on `/facilities`.

## 6. Booking architecture

9-step wizard on `/booking` (intent → date → guests → package → details → notes → summary → payment method → confirmation). Pricing shows "Price on request" until packages are priced; advance line always shows the 50% rule. Payment is an abstract `PaymentProvider` interface with an offline/manual implementation only — no gateway hard-coded.

## 7. Admin architecture

Role-gated `/admin` behind Cloud auth with a `user_roles` table and RLS, added in Phase 7. Dashboard + CRUD modules and a lead pipeline (New → Contacted → Interested → Quotation Sent → Converted → Lost). Availability calendar reads real data only; empty until bookings exist.

## 8. Phases

1. Design system, layout, nav, footer, WhatsApp button, home page
2. Core pages: about, farm-stay, rooms, facilities, experiences hub, events, gallery, packages, blog, contact
3. Ten experience detail pages from one reusable template
4. 3D `/explore` with hotspots, day/night, fallback
5. Lovable Cloud: schema, booking wizard persistence, inquiries
6. WhatsApp deep links everywhere, email confirmation, payment abstraction
7. Admin dashboard, leads, calendar, CMS modules
8. SEO, JSON-LD, analytics events, accessibility, performance pass
9. QA across breakpoints

## 9. Missing info kept configurable

Exact street address and Maps coordinates, all pricing, room count and types, event/pool capacities, property dimensions, cancellation & refund policy, security deposit, min/max stay, payment gateway, logo and final brand colours, real photography, testimonials, Facebook/YouTube/Google Business links, GA4 ID, launch date. Each renders as "Price on request" / "Details on request" / "Coming soon" or an admin-settings field — never as an invented fact. Photography will be generated placeholder imagery, explicitly not presented as property photos.
