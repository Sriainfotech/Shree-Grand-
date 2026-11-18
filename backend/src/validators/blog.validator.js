const { body } = require("express-validator");

const create = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("excerpt").optional({ values: "falsy" }).trim(),
  body("content").optional({ values: "falsy" }).isString(),
  body("category").optional({ values: "falsy" }).trim(),
  body("image").optional({ values: "falsy" }).isString(),
  body("status").optional().isIn(["draft", "published"]),
  body("seoTitle").optional({ values: "falsy" }).trim(),
  body("seoDescription").optional({ values: "falsy" }).trim(),
];

const update = create.map((chain) => chain.optional());

module.exports = { create, update };
