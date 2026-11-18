# Shree Grand Farm Stay — Backend API

Node.js/Express + **Neon (serverless Postgres) via Prisma** API covering the
confirmed website requirements: online booking (no login required),
an inquiry/contact form (emails the business), testimonials, a blog section,
gallery management, WhatsApp link generation, and a payment gateway
integration point. Admins log in (username or email) and can manage
everything; visitors never need an account.

## Stack

- **Express** — HTTP layer
- **Neon** via **Prisma** — serverless Postgres; no local Postgres is used
  anywhere. `DATABASE_URL`/`DIRECT_URL` must point at a real Neon project
- **JWT** — admin/editor authentication (visitors never need an account —
  every booking/inquiry/testimonial-submission endpoint is public)
- **Nodemailer (SMTP)** — emails the business on every new booking/inquiry,
  plus an optional confirmation email back to the visitor
- **Razorpay** — payment gateway (optional; disabled until configured)
- **Meta WhatsApp Cloud API** — optional server-side admin notifications
- **Jest + Supertest** — tests run against a real Postgres database (a
  disposable Neon branch is ideal); see "Running tests" below

## Getting started

1. **Create a Neon project** at [neon.tech](https://neon.tech) (free tier).
   From the project dashboard's **Connect** panel, copy:
   - the **pooled** connection string → `DATABASE_URL`
   - the **direct** (unpooled) connection string → `DIRECT_URL`

2. **Install and configure:**

   ```bash
   cd backend
   npm install                # also runs `prisma generate` via postinstall
   cp .env.example .env       # fill in DATABASE_URL, DIRECT_URL and JWT_SECRET
   ```

3. **Create the database tables:**

   ```bash
   npm run prisma:migrate     # prompts for a migration name, e.g. "init"
   ```

4. **Create your first admin account:**

   ```bash
   npm run create-admin -- "Your Name" yourusername you@example.com "a-strong-password"
   ```

   Log in at `POST /api/auth/login` with `{ "login": "yourusername", "password": "..." }`
   — `login` accepts either the username or the email address.

5. **Start the server:**

   ```bash
   npm run dev                 # http://localhost:5000
   ```

`npm run prisma:studio` opens a browser GUI for inspecting/editing data
directly, useful while there's no admin UI yet.

## Running tests

Tests exercise the real HTTP + database layer (no mocks), so they need a
real Postgres database — **a disposable Neon branch, never your production
database**. In the Neon console: **Branches → Create branch** (e.g.
`test`), copy its pooled connection string, then:

```bash
DATABASE_URL="postgresql://...that-branch...?sslmode=require" npm run prisma:deploy
DATABASE_URL="postgresql://...that-branch...?sslmode=require" npm test
```

Each test file truncates every table after it runs (see `tests/setup.js`),
so the branch stays clean between runs.

## Project structure

```
backend/
├── prisma/
│   └── schema.prisma    # the single source of truth for the DB schema
├── src/
│   ├── config/           # env.js, prisma.js (client), db.js (connect/disconnect), config.js
│   ├── controllers/      # thin — parse req, call a service, shape the response
│   ├── routes/           # Express routers, one per resource
│   ├── services/         # business logic, the only layer that talks to Prisma
│   ├── middleware/        # auth, validation, uploads, rate limiting, errors
│   ├── validators/        # express-validator rule sets
│   ├── utils/             # jwt, password hashing, logger, response envelope, whatsapp
│   ├── app.js             # Express app (no listen())
│   └── server.js          # connects to the database, then calls app.listen()
├── scripts/
│   └── createAdmin.js     # bootstraps the first admin account from the CLI
├── uploads/                # gallery image uploads (served at /uploads/*)
├── tests/
└── .env.example
```

Request flow: `Route → Middleware → Controller → Service → Prisma → Neon Postgres`.

There are no `models/*.js` files — `prisma/schema.prisma` is the schema, and
`npx prisma generate` (run automatically on `npm install`) produces the
typed `@prisma/client` that every service imports via `src/config/prisma.js`.

## API overview

All responses share one envelope:

```json
{ "success": true, "message": "...", "data": {}, "meta": {} }
{ "success": false, "message": "...", "errors": [] }
```

| Requirement                 | Endpoints |
| ---------------------------- | --------- |
| **Online booking integration** | `POST /api/bookings` — **public, no login/account needed** · `GET/PATCH /api/bookings` (admin) |
| **Inquiry / contact form**   | `POST /api/inquiries` — **public, no login needed**, emails the business (see below) · `GET/PATCH /api/inquiries` (admin) |
| **WhatsApp integration**     | `GET /api/whatsapp/link?message=...` → wa.me link. Admin notifications on new bookings/inquiries fire automatically once `WHATSAPP_CLOUD_API_TOKEN` etc. are set |
| **Payment gateway**          | `GET /api/payments/status` · `POST /api/payments/orders` · `POST /api/payments/verify` (Razorpay; 503 until configured) |
| **Gallery**                  | `GET /api/gallery?category=pool` (public) · `POST /api/gallery` with an `image` file field (admin) · `PATCH/DELETE /api/gallery/:id` |
| **Testimonials**             | `GET /api/testimonials` (published only) · `POST /api/testimonials` (public submit, starts unpublished) · admin: `GET /all`, `PATCH/DELETE /:id` |
| **Blog section**             | `GET /api/blog`, `GET /api/blog/:slug` (published only) · admin: `GET /admin/all`, `POST/PUT/DELETE` |
| Rooms (supports the site's Rooms page) | `GET /api/rooms`, `GET /api/rooms/:slug` (public) · admin CRUD under `/api/rooms` |
| Auth — **admin/editor only, never required for visitors** | `POST /api/auth/login` (`{ login, password }`, `login` = username or email) · `GET /api/auth/me` · `POST /api/auth/register` (admin-only, creates more accounts) |

Full request/response shapes are straightforward CRUD — see the relevant
`controllers/*.controller.js` and `validators/*.validator.js` for exact
fields accepted per endpoint.

### Who can do what

- **Visitors**: never log in. They can submit a booking, an inquiry, or a
  testimonial — that's it. No account, no session.
- **`editor`**: logs in; can view/manage bookings, inquiries, rooms, gallery,
  blog and testimonials, but can't delete rooms/gallery items/blog
  posts/testimonials and can't create other accounts.
- **`admin`**: logs in; can do everything an editor can, plus delete
  anything and create more admin/editor accounts (`POST /api/auth/register`).
  Every `authorize(...)` check across every route includes `"admin"`.

### Email on every booking/inquiry

Once `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/`CONTACT_RECEIVER_EMAIL` are set
(see `.env.example`), every new booking and inquiry automatically:

1. emails `CONTACT_RECEIVER_EMAIL` with every field the visitor submitted, and
2. emails the visitor a short confirmation, if they gave an email address.

Both are best-effort (logged, never thrown) — a missing/misconfigured SMTP
setup never breaks the booking/inquiry itself, same pattern as the WhatsApp
and payment integrations.

## Notes on what's real vs. placeholder

- **Testimonials are never shown until an admin explicitly publishes them**
  — a submitted review starts `published: false`. Nothing here fabricates
  guest reviews.
- **Payments are refused, not faked**, until real Razorpay credentials are
  set — `POST /api/payments/orders` returns `503` otherwise.
- **WhatsApp admin notifications are a silent no-op** until Cloud API
  credentials are set; the public `wa.me` link builder works with just
  `BUSINESS_WHATSAPP_NUMBER`.
- **Booking/inquiry/notification emails are a silent no-op** until SMTP is
  configured — see "Email on every booking/inquiry" above.

## Changing the schema

Edit `prisma/schema.prisma`, then run `npm run prisma:migrate` to generate
and apply a migration locally (uses `DIRECT_URL`). For deploying an existing
migration to another environment (e.g. production), use
`npm run prisma:deploy` instead, which applies migrations without prompting
or generating new ones.

## Connecting the frontend

Set `CLIENT_ORIGIN` in `.env` to the deployed frontend's origin(s)
(comma-separated for multiple). The frontend (`frontend/src/config/site.ts`,
`frontend/src/lib/booking.ts`) currently talks to WhatsApp directly and has
no API client yet — wiring `/api/bookings`, `/api/inquiries`, etc. into the
existing forms there is the natural next step once this API is deployed.
