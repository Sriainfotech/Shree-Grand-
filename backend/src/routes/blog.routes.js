const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blog.controller");
const blogValidator = require("../validators/blog.validator");
const validate = require("../middleware/validate.middleware");
const { protect, authorize } = require("../middleware/auth.middleware");

// Public — the "blog section" requirement.
router.get("/", blogController.listPublished);
router.get("/:slug", blogController.getBySlug);

// Admin — author/manage posts.
router.get("/admin/all", protect, authorize("admin", "editor"), blogController.listAll);
router.post(
  "/",
  protect,
  authorize("admin", "editor"),
  blogValidator.create,
  validate,
  blogController.create,
);
router.put(
  "/:id",
  protect,
  authorize("admin", "editor"),
  blogValidator.update,
  validate,
  blogController.update,
);
router.delete("/:id", protect, authorize("admin"), blogController.remove);

module.exports = router;
