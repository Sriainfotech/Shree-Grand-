/**
 * Branded HTML email layout — mirrors the site's forest-green/gold palette
 * (frontend/src/styles.css) so every automated email (booking, inquiry,
 * payment) looks like it came from the same business, not a bare-text
 * script. Email clients strip <style> tags unpredictably, so everything
 * here is table-based layout with inline styles — the one approach that
 * renders consistently across Gmail, Outlook and mobile mail apps.
 *
 * No production domain exists yet (see frontend/src/config/site.ts's `url`
 * placeholder), so the header uses a styled text wordmark rather than a
 * hosted logo image — swap in a real <img> once the site has a live domain
 * email clients can actually fetch from.
 */

const BRAND = {
  name: "Shri Grand Farm Stay",
  tagline: "A Perfect Place for Celebrations",
  phoneDisplay: "+91 90140 07174",
  email: "shreegrandfarmstay@gmail.com",
  location: "Vempally, Mancherial, Telangana",
  colors: {
    forest: "#2c4a3a",
    forestDeep: "#1f3529",
    gold: "#c9a24b",
    ink: "#3a2f26",
    cream: "#faf6ee",
    border: "#e7ddc9",
    muted: "#8a7f6d",
  },
};

/** Escapes text dropped into HTML — every real user-submitted value (name,
 * message, etc.) goes through this before reaching a template. */
function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/** Renders a clean label/value table — used for "here's what they
 * submitted" admin notifications and booking/inquiry summaries. Skips
 * empty fields so the table never shows a blank row. */
function fieldsTable(fields) {
  const { colors } = BRAND;
  const rows = Object.entries(fields)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(
      ([label, value], i) => `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : colors.cream};">
        <td style="padding:10px 16px;font-size:13px;font-weight:600;color:${colors.muted};width:35%;border-bottom:1px solid ${colors.border};vertical-align:top;">${esc(label)}</td>
        <td style="padding:10px 16px;font-size:14px;color:${colors.ink};border-bottom:1px solid ${colors.border};">${esc(value)}</td>
      </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${colors.border};border-radius:6px;overflow:hidden;margin:20px 0;">
      ${rows}
    </table>`;
}

/** The shared header/footer shell every email is wrapped in. `bodyHtml` is
 * the message-specific content (a greeting, a fields table, a CTA...). */
function wrapEmail({ heading, preheader = "", bodyHtml }) {
  const { colors } = BRAND;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:${colors.cream};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <!-- Preheader: shows in the inbox preview, hidden in the email body -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,${colors.forestDeep},${colors.forest});padding:28px 32px;text-align:center;">
                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${colors.gold};font-weight:700;">
                  ${esc(BRAND.name)}
                </p>
                <p style="margin:6px 0 0;font-size:13px;color:#f4ede0;">
                  ${esc(BRAND.tagline)}
                </p>
              </td>
            </tr>
            <!-- Gold accent bar -->
            <tr><td style="height:4px;background:${colors.gold};line-height:0;font-size:0;">&nbsp;</td></tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:${colors.ink};">${esc(heading)}</h1>
                ${bodyHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:${colors.cream};padding:24px 32px;border-top:1px solid ${colors.border};">
                <p style="margin:0 0 6px;font-size:13px;color:${colors.ink};font-weight:600;">${esc(BRAND.name)}</p>
                <p style="margin:0 0 4px;font-size:12px;color:${colors.muted};">${esc(BRAND.location)}</p>
                <p style="margin:0;font-size:12px;color:${colors.muted};">
                  ${esc(BRAND.phoneDisplay)} &nbsp;·&nbsp; ${esc(BRAND.email)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function paragraph(text) {
  return `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:${BRAND.colors.ink};">${text}</p>`;
}

/** A branded CTA button — used for the admin's one-click "Verify payment"
 * link. Table-based so it renders consistently in Outlook, which ignores
 * <button>/<a> padding and border-radius applied via plain CSS. */
function ctaButton(label, url) {
  const { colors } = BRAND;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;">
      <tr>
        <td style="border-radius:6px;background:${colors.forest};">
          <a href="${esc(url)}" target="_blank" rel="noopener"
             style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:700;
                    letter-spacing:0.04em;color:#ffffff;text-decoration:none;border-radius:6px;">
            ${esc(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

// ---------------------------------------------------------------------------
// Booking emails
// ---------------------------------------------------------------------------

function bookingAdminEmailHtml(booking, extra) {
  const bodyHtml =
    paragraph(`A new booking request just came in on the website.`) +
    fieldsTable({
      Name: booking.name,
      Phone: booking.phone,
      Email: booking.email,
      "Check-in": booking.checkIn.toDateString(),
      "Check-out": booking.checkOut ? booking.checkOut.toDateString() : null,
      Slot: booking.slot?.replace(/_/g, " "),
      Guests: booking.guests,
      Occasion: booking.occasion,
      Message: booking.message,
      "Advance required": extra?.advanceLabel,
    });
  return wrapEmail({
    heading: "New booking request",
    preheader: `${booking.name} requested ${booking.checkIn.toDateString()}`,
    bodyHtml,
  });
}

function bookingConfirmationEmailHtml(booking, extra) {
  const bodyHtml =
    paragraph(`Hi ${esc(booking.name)},`) +
    paragraph(
      `Thank you for your booking request. We've received it and will confirm availability shortly on <strong>${esc(booking.phone)}</strong>.`,
    ) +
    fieldsTable({
      "Check-in": booking.checkIn.toDateString(),
      "Check-out": booking.checkOut ? booking.checkOut.toDateString() : null,
      Guests: booking.guests,
      Occasion: booking.occasion,
      "Advance required": extra?.advanceLabel,
    }) +
    paragraph(`We look forward to hosting you.`);
  return wrapEmail({
    heading: "We've received your booking request",
    preheader: "Thank you for booking with us — here's what you submitted.",
    bodyHtml,
  });
}

// ---------------------------------------------------------------------------
// Inquiry (contact form) emails
// ---------------------------------------------------------------------------

function inquiryAdminEmailHtml(inquiry) {
  const bodyHtml =
    paragraph(`A new enquiry just came in through the website contact form.`) +
    fieldsTable({
      Name: inquiry.name,
      Phone: inquiry.phone,
      Email: inquiry.email,
      Occasion: inquiry.occasion,
      Message: inquiry.message,
    });
  return wrapEmail({
    heading: "New website enquiry",
    preheader: `${inquiry.name} sent an enquiry`,
    bodyHtml,
  });
}

function inquiryConfirmationEmailHtml(inquiry) {
  const bodyHtml =
    paragraph(`Hi ${esc(inquiry.name)},`) +
    paragraph(
      `Thank you for contacting us. We've received your message and will reach out to you shortly on <strong>${esc(inquiry.phone)}</strong>.`,
    ) +
    fieldsTable({
      Occasion: inquiry.occasion,
      Message: inquiry.message,
    }) +
    paragraph(`Talk soon!`);
  return wrapEmail({
    heading: "Thank you for contacting us",
    preheader: "We've received your message and will reach out shortly.",
    bodyHtml,
  });
}

// ---------------------------------------------------------------------------
// Payment emails
//
// Flow: Razorpay signature check succeeds -> guest gets
// paymentPendingVerificationEmailHtml + admin gets
// paymentVerificationAdminEmailHtml (with a one-click verify link) -> admin
// verifies (admin panel button, or the email's link) -> guest gets
// paymentVerifiedEmailHtml.
// ---------------------------------------------------------------------------

/** Sent to the guest the moment Razorpay's checkout signature checks out.
 * Deliberately stops short of "confirmed" — a human still has to verify the
 * payment before the booking is final. */
function paymentPendingVerificationEmailHtml(booking, amountInRupees) {
  const bodyHtml =
    paragraph(`Hi ${esc(booking.name)},`) +
    paragraph(
      `We've received your payment. We're just verifying it on our end — you'll get another email as soon as that's done and your booking is confirmed. This usually doesn't take long.`,
    ) +
    fieldsTable({
      "Check-in": booking.checkIn.toDateString(),
      "Check-out": booking.checkOut ? booking.checkOut.toDateString() : null,
      "Amount paid": `₹${amountInRupees.toLocaleString("en-IN")}`,
      "Payment type": booking.paymentType === "full" ? "Full payment" : "Advance payment",
    }) +
    paragraph(`Thanks for your patience — we'll be in touch shortly.`);
  return wrapEmail({
    heading: "Payment received — verifying now",
    preheader: "We've received your payment and are verifying it now.",
    bodyHtml,
  });
}

/** Sent to the business inbox alongside the guest's "pending verification"
 * email — the `verifyUrl` is a signed, no-login link (see
 * utils/actionToken.js) that confirms the payment the moment it's clicked,
 * so the admin can act straight from their phone's mail app. */
function paymentVerificationAdminEmailHtml(booking, payment, amountInRupees, verifyUrl) {
  const bodyHtml =
    paragraph(
      `A payment came in through Razorpay and passed signature verification. Please confirm it actually shows up in the Razorpay dashboard, then click below to confirm the booking and notify the guest.`,
    ) +
    fieldsTable({
      Guest: booking.name,
      Phone: booking.phone,
      Email: booking.email,
      "Check-in": booking.checkIn.toDateString(),
      "Check-out": booking.checkOut ? booking.checkOut.toDateString() : null,
      "Amount paid": `₹${amountInRupees.toLocaleString("en-IN")}`,
      "Payment type": booking.paymentType === "full" ? "Full payment" : "Advance payment",
      "Payment ID": payment.gatewayPaymentId,
    }) +
    ctaButton("Verify payment & confirm booking", verifyUrl) +
    paragraph(
      `If this link has already been used (or you'd rather verify from the admin panel), opening it again is harmless — it won't send a duplicate confirmation to the guest.`,
    );
  return wrapEmail({
    heading: "Payment awaiting verification",
    preheader: `${booking.name} paid ₹${amountInRupees.toLocaleString("en-IN")} — verify to confirm the booking.`,
    bodyHtml,
  });
}

/** Sent to the guest once an admin has verified the payment (via the admin
 * panel button or the email's one-click link) — this is the final
 * "you're confirmed" email. */
function paymentVerifiedEmailHtml(booking, payment, amountInRupees) {
  const bodyHtml =
    paragraph(`Hi ${esc(booking.name)},`) +
    paragraph(
      `Your payment is verified and your booking is now <strong>confirmed</strong>. Here's a summary for your records.`,
    ) +
    fieldsTable({
      "Check-in": booking.checkIn.toDateString(),
      "Check-out": booking.checkOut ? booking.checkOut.toDateString() : null,
      "Amount paid": `₹${amountInRupees.toLocaleString("en-IN")}`,
      "Payment type": booking.paymentType === "full" ? "Full payment" : "Advance payment",
      "Payment ID": payment?.gatewayPaymentId,
    }) +
    paragraph(`We look forward to hosting you.`);
  return wrapEmail({
    heading: "Payment verified — booking confirmed",
    preheader: "Your payment is verified and your booking is confirmed.",
    bodyHtml,
  });
}

module.exports = {
  BRAND,
  esc,
  wrapEmail,
  fieldsTable,
  paragraph,
  ctaButton,
  bookingAdminEmailHtml,
  bookingConfirmationEmailHtml,
  inquiryAdminEmailHtml,
  inquiryConfirmationEmailHtml,
  paymentPendingVerificationEmailHtml,
  paymentVerificationAdminEmailHtml,
  paymentVerifiedEmailHtml,
};
