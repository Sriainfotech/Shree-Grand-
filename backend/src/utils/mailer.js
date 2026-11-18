const env = require("../config/env");
const logger = require("./logger");

const isConfigured = () =>
  Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.contactReceiverEmail);

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  // eslint-disable-next-line global-require
  const nodemailer = require("nodemailer");
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure, // true for port 465, false for 587/25 (STARTTLS)
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
  return transporter;
}

/** Sends a plain-text email. Never throws — a failed/unconfigured email
 * must never fail the booking/inquiry it's reporting on; callers should
 * still `.catch()` for logging, but the promise always resolves. */
async function sendMail({ to, subject, text, html }) {
  // Real credentials in .env must never cause the test suite to send real
  // email — tests exercise this code path via the "not_configured" branch.
  if (env.nodeEnv === "test") {
    logger.debug(`Email skipped (test environment): ${subject}`);
    return { sent: false, reason: "test_environment" };
  }

  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    logger.debug(`Email skipped (SMTP not configured): ${subject}`);
    return { sent: false, reason: "not_configured" };
  }

  try {
    await getTransporter().sendMail({ from: env.smtp.from, to, subject, text, html });
    return { sent: true };
  } catch (error) {
    logger.error(`Email send failed ("${subject}"): ${error.message}`);
    return { sent: false, reason: "send_error" };
  }
}

/** Builds a plain-text fallback from a fields object — used alongside the
 * branded HTML body so mail clients that don't render HTML (or strip it)
 * still show something readable. */
function textFromFields(fields) {
  return Object.entries(fields)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

/** Notifies the business inbox (CONTACT_RECEIVER_EMAIL) of a new booking or
 * inquiry. Pass `html` for the branded template (see emailTemplates.js);
 * `fields` becomes the plain-text fallback body. */
async function notifyAdmin(subject, fields, html) {
  if (!env.contactReceiverEmail) {
    logger.debug(`Admin email skipped (CONTACT_RECEIVER_EMAIL not set): ${subject}`);
    return { sent: false, reason: "not_configured" };
  }

  return sendMail({ to: env.contactReceiverEmail, subject, text: textFromFields(fields), html });
}

/** Optional courtesy confirmation back to the visitor, only sent if they
 * gave an email address. */
async function confirmToSender({ to, subject, text, html }) {
  if (!to) return { sent: false, reason: "no_recipient_email" };
  return sendMail({ to, subject, text, html });
}

module.exports = { isConfigured, sendMail, notifyAdmin, confirmToSender };
