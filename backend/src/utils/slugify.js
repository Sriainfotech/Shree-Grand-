/** Simple, dependency-free slugify — lowercase, alphanumeric words joined by
 * single hyphens. Good enough for blog-post and gallery-item slugs. */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = slugify;
