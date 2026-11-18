/**
 * Non-secret application configuration — constants that shape behaviour but
 * aren't credentials, so they live here instead of in .env.
 */
module.exports = {
  api: {
    prefix: "/api",
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  booking: {
    // Mirrors the business's confirmed policy — kept in one place so it can
    // be surfaced consistently in API responses and admin notifications.
    advancePercentage: 25,
    checkInTime: "12:00 PM",
    checkOutTime: "10:00 AM",
  },

  uploads: {
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },

  cors: {
    // Additional origins (comma-separated) can be added via CLIENT_ORIGIN
    // in .env for staging/preview deployments.
    credentials: true,
  },
};
