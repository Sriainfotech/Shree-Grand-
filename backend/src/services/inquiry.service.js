const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const whatsapp = require("../utils/whatsapp");
const mailer = require("../utils/mailer");
const emailTemplates = require("../utils/emailTemplates");
const logger = require("../utils/logger");

async function create(data) {
  const inquiry = await prisma.inquiry.create({ data });

  // Best-effort notifications — never block or fail the inquiry itself if
  // WhatsApp/SMTP aren't configured or a send fails.
  whatsapp
    .notifyAdmin(
      `New enquiry on the website:\nName: ${inquiry.name}\nPhone: ${inquiry.phone}\n` +
        `Occasion: ${inquiry.occasion || "-"}\nMessage: ${inquiry.message || "-"}`,
    )
    .catch((error) => logger.error(`Inquiry WhatsApp notification failed: ${error.message}`));

  mailer
    .notifyAdmin(
      `New enquiry — ${inquiry.name}`,
      {
        Name: inquiry.name,
        Phone: inquiry.phone,
        Email: inquiry.email,
        Occasion: inquiry.occasion,
        Message: inquiry.message,
      },
      emailTemplates.inquiryAdminEmailHtml(inquiry),
    )
    .catch((error) => logger.error(`Inquiry email notification failed: ${error.message}`));

  mailer
    .confirmToSender({
      to: inquiry.email,
      subject: "Thanks for reaching out — Shri Grand Farm Stay",
      text: `Hi ${inquiry.name},\n\nThanks for contacting us — we'll reach out to you shortly on ${inquiry.phone}.\n\n— Shri Grand Farm Stay`,
      html: emailTemplates.inquiryConfirmationEmailHtml(inquiry),
    })
    .catch((error) => logger.error(`Inquiry confirmation email failed: ${error.message}`));

  return inquiry;
}

async function list({ status, page = 1, limit = 20 }) {
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.inquiry.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.inquiry.count({ where: filter }),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function updateStatus(id, status) {
  try {
    return await prisma.inquiry.update({ where: { id }, data: { status } });
  } catch (error) {
    if (error.code === "P2025") throw ApiError.notFound("Inquiry not found");
    throw error;
  }
}

module.exports = { create, list, updateStatus };
