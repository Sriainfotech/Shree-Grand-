const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const env = require("./config/env");
const config = require("./config/config");
const routes = require("./routes");
const { uploadsPath } = require("./middleware/upload.middleware");
const { apiLimiter } = require("./middleware/rateLimit.middleware");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin.split(",").map((origin) => origin.trim()),
    credentials: config.cors.credentials,
  }),
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// Uploaded gallery images are served statically from here.
app.use("/uploads", express.static(uploadsPath));

app.use(config.api.prefix, apiLimiter, routes);

app.get("/", (req, res) => {
  res.json({ message: "Shri Grand Farm Stay API is running" });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
