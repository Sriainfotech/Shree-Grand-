const dotenv = require("dotenv");

dotenv.config();

/**
 * Central, validated environment access. Anything the app reads from
 * process.env should be read through here so a missing required value fails
 * fast at boot instead of surfacing as a confusing runtime error later.
 */
const required = ["DATABASE_URL", "JWT_SECRET"];

const missing = required.filter((key) => !process.env[key]);
if (missing.length && process.env.NODE_ENV !== "test") {
  // eslint-disable-next-line no-console
  console.error(
    `Missing required environment variable(s): ${missing.join(", ")}. ` +
      "Copy .env.example to .env and fill these in before starting the server.",
  );
  process.exit(1);
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

  // Neon (serverless Postgres) connection strings — read directly by
  // Prisma via prisma/schema.prisma's env("DATABASE_URL")/env("DIRECT_URL"),
  // kept here too for anything outside Prisma that needs them.
  // DATABASE_URL: Neon's pooled (PgBouncer) connection string, used by the
  //   running app — looks like:
  //   postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require
  // DIRECT_URL: Neon's direct (unpooled) connection string, used only for
  //   migrations — same host without "-pooler".
  databaseUrl: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",

  // Same GTM container the frontend loads (frontend/src/config/site.ts's
  // analytics.gtmId) — needed so the standalone "Verify payment" page
  // (opened straight from the admin's email, never inside the frontend
  // React app) can fire its own "booking_confirmed" dataLayer event. Not a
  // secret — GTM container ids are public, embedded in every page's HTML.
  gtmContainerId: process.env.GTM_CONTAINER_ID || null,

  // This server's own publicly-reachable base URL — needed to build the
  // one-click "Verify payment" link sent in the admin notification email
  // (that link is a GET to this API, opened straight from the inbox, not a
  // frontend route). Falls back to localhost for local development.
  apiBaseUrl: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,

  // Razorpay is the most common gateway for Indian businesses. Payment
  // routes stay disabled (return 503) until both of these are set — see
  // src/services/payment.service.js.
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || null,

  // WhatsApp Cloud API (Meta) — used only for optional server-side admin
  // notifications on new bookings/inquiries. The public-facing WhatsApp
  // "chat with us" links are plain wa.me deep links and need no credentials
  // (see src/utils/whatsapp.js). Notifications stay disabled until both of
  // these are set.
  whatsappToken: process.env.WHATSAPP_CLOUD_API_TOKEN || null,
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || null,
  whatsappAdminNumber: process.env.WHATSAPP_ADMIN_NUMBER || null,

  // Business WhatsApp number used to build wa.me links, in international
  // format without "+" or spaces, e.g. 919014007174.
  businessWhatsappNumber: process.env.BUSINESS_WHATSAPP_NUMBER || null,

  // SMTP — powers the "contact form emails the business" requirement
  // (new bookings and inquiries) plus an optional confirmation email back
  // to the person who submitted the form. Works with any SMTP provider —
  // Gmail (with an app password), SendGrid, Mailgun, Resend's SMTP relay,
  // your host's own mailbox, etc. Notifications stay a silent no-op until
  // all of SMTP_HOST/SMTP_USER/SMTP_PASS/CONTACT_RECEIVER_EMAIL are set.
  smtp: {
    host: process.env.SMTP_HOST || null,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null,
    from: process.env.SMTP_FROM || process.env.SMTP_USER || null,
  },
  // Where new-booking/new-inquiry notification emails are sent.
  contactReceiverEmail: process.env.CONTACT_RECEIVER_EMAIL || null,

  uploadsDir: process.env.UPLOADS_DIR || "uploads",
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB) || 5,
};

module.exports = env;
