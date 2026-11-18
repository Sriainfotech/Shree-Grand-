const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/bookings", require("./booking.routes"));
router.use("/inquiries", require("./inquiry.routes"));
router.use("/testimonials", require("./testimonial.routes"));
router.use("/blog", require("./blog.routes"));
router.use("/property", require("./property.routes"));
router.use("/gallery", require("./gallery.routes"));
router.use("/uploads", require("./upload.routes"));
router.use("/payments", require("./payment.routes"));
router.use("/whatsapp", require("./whatsapp.routes"));

module.exports = router;
