const env = require("../config/env");
const logger = require("./logger");

/**
 * Builds a wa.me click-to-chat link the same way the frontend does — needs
 * no credentials, works as soon as BUSINESS_WHATSAPP_NUMBER is set.
 */
function buildChatLink(message = "") {
  if (!env.businessWhatsappNumber) return null;
  const text = encodeURIComponent(message);
  return `https://wa.me/${env.businessWhatsappNumber}${text ? `?text=${text}` : ""}`;
}

/**
 * Sends an admin-facing WhatsApp notification via Meta's WhatsApp Cloud API
 * (e.g. "New booking request from Priya for 12 Aug"). This is optional and
 * a pure no-op — never throws — until WHATSAPP_CLOUD_API_TOKEN,
 * WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ADMIN_NUMBER are all set in .env.
 * Callers (booking/inquiry services) should fire-and-forget this; a
 * notification failing must never fail the underlying booking/inquiry.
 */
async function notifyAdmin(message) {
  // Real credentials in .env must never cause the test suite to send a real
  // WhatsApp message — tests exercise this code path via the "not_configured"
  // branch below.
  if (env.nodeEnv === "test") {
    logger.debug("WhatsApp admin notification skipped (test environment).");
    return { sent: false, reason: "test_environment" };
  }

  const { whatsappToken, whatsappPhoneNumberId, whatsappAdminNumber } = env;
  if (!whatsappToken || !whatsappPhoneNumberId || !whatsappAdminNumber) {
    logger.debug("WhatsApp admin notification skipped — Cloud API not configured.");
    return { sent: false, reason: "not_configured" };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${whatsappPhoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: whatsappAdminNumber,
          type: "text",
          text: { body: message },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      logger.error(`WhatsApp Cloud API notification failed (${res.status}): ${body}`);
      return { sent: false, reason: "api_error" };
    }

    return { sent: true };
  } catch (error) {
    logger.error(`WhatsApp Cloud API notification error: ${error.message}`);
    return { sent: false, reason: "network_error" };
  }
}

module.exports = { buildChatLink, notifyAdmin };
