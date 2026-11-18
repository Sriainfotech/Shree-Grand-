const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const whatsapp = require("../utils/whatsapp");

// The "WhatsApp integration" requirement. The frontend can build wa.me
// links itself, but exposing it here too keeps the phone number/format in
// one place (server-side) for anything else that needs it (e.g. a
// confirmation email with a WhatsApp link).
router.get(
  "/link",
  asyncHandler(async (req, res) => {
    const link = whatsapp.buildChatLink(req.query.message || "");
    return success(res, { data: { link } });
  }),
);

module.exports = router;
